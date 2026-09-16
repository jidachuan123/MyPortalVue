<template>
  <div class="jh-portal">
    <!-- ======= 顶部导航 ======= -->
    <header class="jh-nav">
      <div class="jh-nav-inner">
        <a class="jh-brand" href="#" @click.prevent="scrollTo('top')">佳和商业</a>
        <nav class="jh-nav-links">
          <a href="#" @click.prevent="scrollTo('top')">首页</a>
          <a href="#" @click.prevent="scrollTo('about')">关于我们</a>
          <a class="jh-btn jh-btn-primary" href="#" @click.prevent="scrollTo('contact')">联系我们</a>
        </nav>
      </div>
    </header>

    <!-- ======= Hero：标题 + 两个系统入口卡片 ======= -->
    <section id="top" class="jh-hero">
      <div class="jh-hero-overlay"></div>
      <div class="jh-hero-content">
        <h1>佳和商业供应链门户</h1>
        <p class="jh-hero-sub">一站式供应链系统访问平台</p>

        <div class="jh-sys-cards">
          <div v-for="sys in systems" :key="sys.name" class="jh-sys-card">
            <div class="jh-sys-icon">
              <el-icon :size="30"><component :is="sys.icon" /></el-icon>
            </div>
            <h3>{{ sys.name }}</h3>
            <p>{{ sys.desc }}</p>
            <a class="jh-btn jh-btn-primary" :href="sys.url">
              立即登录
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= 关于区块 ======= -->
    <section id="about" class="jh-about">
      <h2>关于佳和商业</h2>
      <p class="jh-about-text">
        佳和商业是一家专注于供应链管理的现代化企业，致力于为经销商提供高效、便捷的供应链服务。
        我们整合优质资源，搭建数字化供应链平台，帮助合作伙伴实现商品信息查询、订单管理、
        物流跟踪等核心业务需求。多年来，我们始终坚持专业、可靠的服务理念，赢得了广大经销商的信任与支持。
      </p>

      <div class="jh-feature-grid">
        <div v-for="f in features" :key="f.title" class="jh-feature-card">
          <div class="jh-sys-icon">
            <el-icon :size="26"><component :is="f.icon" /></el-icon>
          </div>
          <h4>{{ f.title }}</h4>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ======= 页脚 ======= -->
    <footer id="contact" class="jh-footer">
      <div class="jh-footer-inner">
        <div class="jh-footer-col">
          <h5>联系方式</h5>
          <p>电话：400-898-8888</p>
          <p>邮箱：service@jiahehangye.com</p>
          <p>地址：浙江省杭州市西湖区文三路 100 号</p>
        </div>
        <div class="jh-footer-col">
          <h5>快速导航</h5>
          <a href="#" @click.prevent="scrollTo('top')">首页</a>
          <a href="#" @click.prevent="scrollTo('about')">关于我们</a>
        </div>
        <div class="jh-footer-col">
          <h5>供应链系统</h5>
          <a v-for="sys in systems" :key="sys.name" :href="sys.url">{{ sys.name }}</a>
        </div>
      </div>
      <div class="jh-footer-bottom">
        <p>© 2026 佳和商业. 保留所有权利.</p>
        <p>浙 ICP 备 12345678 号</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ShoppingCart, Box, Van, CircleCheck, Setting } from '@element-plus/icons-vue'

// 两个供应商系统入口：点击「立即登录」直接跳转对应系统
const systems = [
  {
    name: '佳和超市供应商系统',
    desc: '查看超市商品信息、订单状态、库存数据',
    url: 'http://192.168.0.54:9006/#/',
    icon: ShoppingCart
  },
  {
    name: '佳和资材供应商系统',
    desc: '查看资材商品信息、采购订单、物流跟踪',
    url: 'http://192.168.0.61:7022/#/',
    icon: Box
  }
]

const features = [
  {
    title: '高效供应链',
    desc: '整合优质资源，提供快速响应的供应链服务，确保商品流通高效顺畅',
    icon: Van
  },
  {
    title: '品质保障',
    desc: '严格的质量管控体系，确保每一件商品的品质，让经销商放心合作',
    icon: CircleCheck
  },
  {
    title: '专业服务',
    desc: '专业的服务团队，提供全方位的技术支持和业务咨询，助力经销商成功',
    icon: Setting
  }
]

function scrollTo(id) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* ====== 主题色（对齐参考稿：Tailwind blue 系） ======
   主色   #1e40af   hover #2563eb   遮罩 rgba(30,58,138,.7)
   图标底 #dbeafe   正文灰 #4b5563   浅灰背景 #f9fafb        */

.jh-portal {
  min-height: 100vh;
  background: #fff;
  color: #111827;
}

/* ====== 顶部导航 ====== */
.jh-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.jh-nav-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.jh-brand {
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  text-decoration: none;
}

.jh-nav-links {
  display: flex;
  align-items: center;
  gap: 26px;
}

.jh-nav-links a {
  font-size: 15px;
  color: #374151;
  text-decoration: none;
  transition: color 0.2s;
}

.jh-nav-links a:hover {
  color: #1e40af;
}

/* ====== 按钮 ====== */
.jh-btn {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.jh-btn-primary {
  background: #1e40af;
  color: #fff;
}

/* 覆盖 .jh-nav-links a 的灰色文字（后者优先级更高，需显式压回） */
.jh-nav-links a.jh-btn-primary {
  color: #fff;
}

.jh-btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* ====== Hero ====== */
.jh-hero {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  background: url('/images/hero-warehouse.jpg') center / cover no-repeat;
}

.jh-hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 58, 138, 0.7);
}

.jh-hero-content {
  position: relative;
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;
  padding: 64px 24px;
  text-align: center;
  color: #fff;
}

.jh-hero-content h1 {
  font-size: 46px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.jh-hero-sub {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 56px;
}

/* ====== 系统入口卡片 ====== */
.jh-sys-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 400px));
  justify-content: center;
  gap: 32px;
}

.jh-sys-card {
  background: #fff;
  border-radius: 12px;
  padding: 36px 28px 32px;
  color: #111827;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  transition: transform 0.25s, box-shadow 0.25s;
}

.jh-sys-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.25);
}

.jh-sys-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1e40af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jh-sys-card h3 {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
}

.jh-sys-card p {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 22px;
}

/* ====== 关于区块 ====== */
.jh-about {
  background: #f9fafb;
  padding: 80px 24px;
  text-align: center;
}

.jh-about h2 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 28px;
}

.jh-about-text {
  max-width: 780px;
  margin: 0 auto 56px;
  font-size: 15px;
  line-height: 2;
  color: #374151;
  text-align: justify;
  text-align-last: center;
}

.jh-feature-grid {
  max-width: 1152px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.jh-feature-card {
  background: #fff;
  border-radius: 8px;
  padding: 36px 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s, box-shadow 0.25s;
}

.jh-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

.jh-feature-card .jh-sys-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
}

.jh-feature-card h4 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px;
}

.jh-feature-card p {
  font-size: 13.5px;
  color: #4b5563;
  line-height: 1.8;
}

/* ====== 页脚 ====== */
.jh-footer {
  background: #1e40af;
  color: #fff;
}

.jh-footer-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 56px 24px 40px;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 40px;
}

.jh-footer-col h5 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 18px;
}

.jh-footer-col p,
.jh-footer-col a {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 10px;
  text-decoration: none;
}

.jh-footer-col a:hover {
  color: #fff;
  text-decoration: underline;
}

.jh-footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  padding: 20px 24px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.jh-footer-bottom p {
  margin: 4px 0;
}

/* ====== 响应式 ====== */
@media (max-width: 860px) {
  .jh-hero-content h1 {
    font-size: 32px;
  }
  .jh-sys-cards {
    grid-template-columns: 1fr;
  }
  .jh-feature-grid {
    grid-template-columns: 1fr;
  }
  .jh-footer-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .jh-nav-links a:not(.jh-btn) {
    display: none;
  }
}
</style>
