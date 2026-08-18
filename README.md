# 企业门户系统（单点登录 SSO 演示）

统一登录入口，一次认证后免登录跳转 A / B / C 三个业务子系统（当前为模拟演示）。

## 一、项目结构

```
C:\work\portal\
├── vue-portal\                      # 前端门户（Vue3 + Vite + Element Plus）
│   ├── src\
│   │   ├── views\
│   │   │   ├── Login.vue            # 登录页
│   │   │   ├── Portal.vue           # 门户首页（A/B/C 子系统卡片）
│   │   │   └── subsystem\
│   │   │       ├── SubA.vue         # 模拟子系统A（报表系统）
│   │   │       ├── SubB.vue         # 模拟子系统B（商品系统）
│   │   │       └── SubC.vue         # 模拟子系统C（对接系统）
│   │   ├── api\                     # axios 封装 + 门户接口
│   │   ├── router\                  # 路由 + 登录守卫
│   │   ├── stores\                  # Pinia 用户状态
│   │   └── styles\                  # 全局样式
│   └── vite.config.js               # 端口 3002，代理 /api → 8002
└── (后端复用 springcloud-demo，无新服务)
```

后端改动（已加入 `C:\work\springcloud-demo`）：
- 新增 `consumer-service/.../portal/controller/PortalController.java`
  - `GET  /consumer/portal/me`              当前登录用户信息
  - `POST /consumer/portal/sso-ticket`      生成一次性 SSO 票据（JWT 签名，2 分钟有效）
  - `GET  /consumer/portal/validate-ticket` 子系统验证票据，换取用户信息
  - `GET  /consumer/portal/subsystems`      子系统列表（A/B/C 配置）
- 可选建表脚本：`sql/portal_sso_ddl.sql`（真实部署时按需执行，当前模拟不依赖表）

## 二、启动步骤

### 1. 启动后端（三个服务）

```bash
cd C:\work\springcloud-demo
# 依次启动（或使用 start_eureka.bat + 手动启动）
mvn spring-boot:run -pl eureka-server    # 端口 8761
mvn spring-boot:run -pl provider-service # 端口 8001（连 SQLServer RDS_BC/RDS_SC）
# consumer-service 建议打包后以 jar 方式启动（spring-boot:run 偶发随机端口）
mvn package -pl consumer-service -DskipTests
cd consumer-service
java -jar target/consumer-service-1.0.0.jar --server.port=8002  # 登录/SSO 接口
```

> 注意：Provider 启动时会自动初始化 `admin` 用户（密码 `123456`），前提是
> RDS_SC 库中已执行过 `sql/shiro_auth_ddl.sql` 建好权限表。

### 2. 启动前端门户

```bash
cd C:\work\portal\vue-portal
npm install
npm run dev        # 端口 3002，浏览器访问 http://localhost:3002
```

### 3. 使用

1. 打开 `http://localhost:3002`，会自动跳转登录页
2. 输入 `admin` / `123456` 登录
3. 门户首页展示三个子系统卡片，点击任意卡片 → 后端签发 SSO 票据 → 免登录进入对应模拟子系统
4. 子系统页可"返回门户"；再次进入其他子系统同样免登录

## 三、SSO 模拟流程（当前实现）

```
用户登录 ──> POST /consumer/auth/login ──> 获得 JWT，存 localStorage
                                        │
门户点击"子系统A" ──> POST /consumer/portal/sso-ticket（带 JWT）
                                        │
                       返回一次性 ticket（JWT 签名，2分钟有效）
                                        │
跳转 /sub/a?ticket=xxx（模拟跳转到子系统A独立页面）
                                        │
子系统A页面 ──> GET /consumer/portal/validate-ticket?ticket=xxx
                                        │
                       验证通过，返回用户信息 ──> 展示子系统业务页
```

## 四、后期真实跳转方案（生产落地）

当前 A/B/C 是门户内部的模拟路由。真实场景下 A/B/C 是**独立部署的系统**，
跳转需要走标准 SSO 票据模式：

### 方案 A：票据（Ticket）模式 —— 推荐

1. **门户签发票据**：用户登录门户后点击子系统 A，后端调用
   `POST /consumer/portal/sso-ticket` 生成一次性 ticket。
2. **重定向子系统**：门户返回 `redirectUrl`（子系统 A 的 SSO 入口地址 +
   `?ticket=xxx`），前端 `window.location.href = redirectUrl` 跳转。
3. **子系统校验**：子系统 A 的服务端拿到 ticket，回调门户
   `GET /consumer/portal/validate-ticket?ticket=xxx`（子系统间走服务端
   内网调用），校验通过后拿到用户信息，子系统 A 自行建立会话
   （如签发自己的 session / JWT）。
4. **票据一次性**：`sso_ticket` 表记录票据使用状态，首次使用后置为
   `1=已使用`，防止重放。

实现要点：
- 各子系统的 SSO 入口统一规范为 `GET /sso/login?ticket=xxx`
- 子系统注册到 `sys_app` 表（`app_url` 即 SSO 入口地址）
- 子系统回调门户校验接口需走服务端（避免前端直接暴露校验接口，
  增加内网 IP 白名单）

### 方案 B：共享 Token 模式（简单，适合同域部署）

- 门户与子系统部署在同一域名下（如 `*.company.com`），登录后把 JWT
  写入一级域名 Cookie（`domain=.company.com`），各子系统从 Cookie 读取
  并校验同一个 JWT（共享 secret）。
- 优点：实现最简单；缺点：需同域部署、共享密钥，安全边界弱。

### 方案 C：OAuth2 / OIDC（适合多系统、开放生态）

- 门户作为授权服务器，子系统作为 Client，走标准授权码流程，可选用
  Spring Authorization Server 或 Keycloak。功能最全但改动最大。

### 推荐路线

先按**方案 A（票据模式）**落地：复用现有 JWT 体系 + 新增的
`sso-ticket`/`validate-ticket` 接口，只需：
1. 执行 `sql/portal_sso_ddl.sql` 建 `sys_app`、`sso_ticket` 表；
2. 各子系统实现 `/sso/login?ticket=xxx` 入口并回调门户校验；
3. 门户把"进入子系统"从前端路由改为跳转真实 `app_url`。

## 五、接口汇总

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | /consumer/auth/login | 登录，返回 JWT | 无 |
| GET  | /consumer/portal/me | 当前用户信息 | JWT |
| POST | /consumer/portal/sso-ticket | 签发 SSO 一次性票据 | JWT |
| GET  | /consumer/portal/validate-ticket?ticket= | 验证票据 | 无(建议内网) |
| GET  | /consumer/portal/subsystems | 子系统列表 | JWT |
| POST | /consumer/auth/logout | 登出（无状态，前端清 token） | JWT |

## 六、可选建表 SQL

见 `C:\work\springcloud-demo\sql\portal_sso_ddl.sql`：
- `sys_app`：子系统注册表（app_code / app_name / app_url / status）
- `sso_ticket`：SSO 票据审计表（一次性使用 + 留痕）
