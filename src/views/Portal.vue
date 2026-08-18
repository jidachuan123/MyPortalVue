<template>
  <div class="page-container portal-page">
    <!-- 顶栏 -->
    <header class="portal-header">
      <div class="header-left">
        <div class="logo">◆</div>
        <span class="app-name">企业门户系统</span>
        <el-tag size="small" type="primary" effect="dark" class="sso-tag">SSO 单点登录</el-tag>
      </div>
      <div class="header-right">
        <el-avatar :size="34" class="user-avatar">{{ avatarText }}</el-avatar>
        <span class="user-name">{{ userStore.realName || userStore.username }}</span>
        <el-dropdown @command="handleCommand">
          <el-button size="small" text>更多操作</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 欢迎区 -->
    <div class="welcome-banner">
      <div>
        <h2>你好，{{ userStore.realName || userStore.username }} 👋</h2>
        <p>已通过统一身份认证，点击下方卡片即可免登录进入各业务子系统。</p>
      </div>
      <div class="role-tags">
        <el-tag v-for="r in roles" :key="r" type="success" effect="light" class="role-tag">
          {{ roleName(r) }}
        </el-tag>
      </div>
    </div>

    <!-- 子系统卡片区 -->
    <div class="subsystem-title">
      <h3>业务子系统</h3>
      <span>单点登录 · 一次认证，随处通行</span>
    </div>

    <div v-loading="loading" class="subsystem-grid">
      <div
        v-for="(sub, i) in subsystems"
        :key="sub.code"
        class="subsystem-card"
        :style="{ '--card-color': sub.color }"
        @click="enterSubsystem(sub)"
      >
        <div class="card-icon">
          <el-icon :size="40"><component :is="sub.icon" /></el-icon>
        </div>
        <div class="card-name">{{ sub.name }}</div>
        <div class="card-desc">{{ sub.desc }}</div>
        <div class="card-footer">
          <el-button type="primary" size="small" text>
            进入系统 <el-icon><Right /></el-icon>
          </el-button>
        </div>
        <span class="card-badge">#{{ sub.code }}</span>
      </div>
    </div>

    <!-- SSO 流程说明 -->
    <el-card class="sso-flow-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><InfoFilled /></el-icon>
          <span>SSO 单点登录流程（子系统A已真实对接）</span>
        </div>
      </template>
      <el-steps :active="4" align-center finish-status="success" class="sso-steps">
        <el-step title="门户登录" description="输入账号密码，获取 JWT" />
        <el-step title="生成票据" description="后端签发 SSO Ticket（带 targetApp）" />
        <el-step title="跳转子系统" description="window.location.href 携带 Ticket 真实跳转" />
        <el-step title="子系统验签" description="子系统用共享密钥本地验签，免登录进入" />
      </el-steps>
    </el-card>

    <!-- 登录信息 -->
    <el-descriptions :column="3" border size="small" class="user-info-card" title="当前登录信息">
      <el-descriptions-item label="用户ID">{{ userInfo?.userId }}</el-descriptions-item>
      <el-descriptions-item label="用户名">{{ userInfo?.username }}</el-descriptions-item>
      <el-descriptions-item label="真实姓名">{{ userInfo?.realName }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Right, SwitchButton, InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'
import { getSubsystems, createSsoTicket } from '../api/portal'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const subsystems = ref([])
const userInfo = computed(() => userStore.userInfo)
const roles = computed(() => userStore.userInfo?.roles || [])
const avatarText = computed(() => (userStore.realName || userStore.username || 'U').slice(0, 1).toUpperCase())

const ROLE_NAMES = {
  admin: '管理员',
  operator: '操作员',
  viewer: '只读用户'
}

function roleName(code) {
  return ROLE_NAMES[code] || code
}

onMounted(async () => {
  try {
    if (!userStore.userInfo) {
      await userStore.fetchMe()
    }
    const res = await getSubsystems()
    subsystems.value = res.result
  } catch (e) {
    // 已由拦截器处理
  }
})

async function enterSubsystem(sub) {
  loading.value = true
  try {
    // 1. 生成一次性 SSO 票据（指定目标子系统编码，ticket 带 targetApp 防跨系统冒用）
    const res = await createSsoTicket(sub.code)
    const { ticket, mode, redirectUrl, path } = res.result

    ElMessage.success(`正在通过 SSO 免登录进入 ${sub.name}...`)

    // 2. 跳转子系统
    setTimeout(() => {
      if (mode === 'redirect' && redirectUrl) {
        // 真实子系统：浏览器真实跳转（跳出本站，由子系统自行验证 ticket 建立会话）
        window.location.href = redirectUrl
      } else {
        // 模拟子系统：本站内前端路由跳转
        router.push({ path, query: { ticket } })
      }
    }, 600)
  } catch (e) {
    // 已由拦截器处理
  } finally {
    loading.value = false
  }
}

async function handleCommand(cmd) {
  if (cmd === 'logout') {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style scoped>
.portal-page {
  max-width: 1200px;
  margin: 0 auto;
}

.portal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409EFF, #36cfc9);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2d3d;
}

.sso-tag {
  margin-left: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  background: #409EFF;
  color: #fff;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.welcome-banner {
  background: linear-gradient(120deg, #409EFF 0%, #36cfc9 100%);
  border-radius: 12px;
  padding: 28px 32px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.25);
}

.welcome-banner h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.welcome-banner p {
  font-size: 14px;
  opacity: 0.9;
}

.role-tag {
  background: rgba(255, 255, 255, 0.9);
  border: none;
}

.subsystem-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.subsystem-title h3 {
  font-size: 18px;
  color: #1f2d3d;
}

.subsystem-title span {
  font-size: 13px;
  color: #909399;
}

.subsystem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
  min-height: 180px;
}

.subsystem-card {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px 20px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ebeef5;
  transition: all 0.25s ease;
  overflow: hidden;
}

.subsystem-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
}

.subsystem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(31, 45, 61, 0.12);
  border-color: var(--card-color);
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--card-color);
  background: color-mix(in srgb, var(--card-color) 10%, white);
}

.card-name {
  font-size: 17px;
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 16px;
  min-height: 36px;
}

.card-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 12px;
  font-weight: 600;
  color: var(--card-color);
  background: color-mix(in srgb, var(--card-color) 10%, white);
  padding: 2px 8px;
  border-radius: 10px;
}

.sso-flow-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #303133;
}

.sso-steps {
  padding: 8px 0 12px;
}

.user-info-card {
  margin-top: 4px;
}

@media (max-width: 900px) {
  .subsystem-grid {
    grid-template-columns: 1fr;
  }
  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
