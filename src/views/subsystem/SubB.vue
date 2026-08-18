<template>
  <div class="sub-page">
    <header class="sub-header">
      <div class="header-left">
        <div class="logo" style="background:#67C23A">B</div>
        <span class="app-name">子系统B · 商品管理系统</span>
      </div>
      <div class="header-right">
        <el-tag v-if="ssoState === 'success'" type="success" effect="dark">
          ✓ SSO 已认证（{{ ssoUser?.realName || ssoUser?.username }}）
        </el-tag>
        <el-tag v-else-if="ssoState === 'loading'" type="info" effect="dark">票据验证中...</el-tag>
        <el-tag v-else type="danger" effect="dark">✗ 未认证</el-tag>
        <el-button size="small" type="success" plain @click="goPortal">返回门户</el-button>
      </div>
    </header>

    <div v-if="ssoState === 'loading'" class="loading-box" v-loading="true"></div>

    <el-alert
      v-else-if="ssoState === 'fail'"
      type="error"
      :title="errorMsg"
      description="SSO 票据无效或已过期，请从门户重新进入。"
      show-icon
      :closable="false"
      class="sub-alert"
    />

    <template v-else>
      <div class="page-container">
        <el-row :gutter="16" class="stat-row">
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">3,582</div><div class="stat-label">在售商品</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">96</div><div class="stat-label">缺货预警</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">1,204</div><div class="stat-label">待上架</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">18</div><div class="stat-label">供应商</div></div></el-card></el-col>
        </el-row>

        <el-card shadow="never" class="table-card">
          <template #header><b>商品列表（模拟数据）</b></template>
          <el-table :data="goods" size="small" stripe>
            <el-table-column prop="code" label="商品编码" width="120" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="category" label="分类" width="120" />
            <el-table-column prop="price" label="单价(元)" width="100" />
            <el-table-column prop="stock" label="库存" width="90" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '在售' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { validateTicket } from '../../api/portal'

const route = useRoute()
const router = useRouter()

const ssoState = ref('loading')
const ssoUser = ref(null)
const errorMsg = ref('')

const goods = [
  { code: 'P10001', name: '无线蓝牙耳机 Pro', category: '数码', price: 399.0, stock: 1200, status: '在售' },
  { code: 'P10002', name: '智能手表 S2', category: '数码', price: 899.0, stock: 45, status: '在售' },
  { code: 'P10003', name: '便携充电宝 20000mAh', category: '配件', price: 129.0, stock: 0, status: '下架' },
  { code: 'P10004', name: '机械键盘 87键', category: '外设', price: 299.0, stock: 800, status: '在售' }
]

onMounted(async () => {
  const ticket = route.query.ticket
  if (!ticket) {
    ssoState.value = 'fail'
    errorMsg.value = '缺少 SSO 票据参数'
    return
  }
  try {
    const res = await validateTicket(ticket)
    ssoUser.value = res.result
    ssoState.value = 'success'
  } catch (e) {
    ssoState.value = 'fail'
    errorMsg.value = '票据验证失败'
  }
})

function goPortal() {
  router.push('/')
}
</script>

<style scoped>
.sub-page { min-height: 100vh; background: #f0f2f5; }
.sub-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px; background: #fff; border-bottom: 1px solid #e4e7ed;
}
.header-left { display: flex; align-items: center; gap: 10px; }
.logo {
  width: 32px; height: 32px; border-radius: 6px; color: #fff;
  display: flex; align-items: center; justify-content: center; font-weight: 700;
}
.app-name { font-size: 16px; font-weight: 600; color: #1f2d3d; }
.header-right { display: flex; align-items: center; gap: 12px; }
.loading-box { min-height: 60vh; }
.sub-alert { margin: 24px; }
.stat-row { margin-bottom: 16px; }
.stat { text-align: center; padding: 8px 0; }
.stat-num { font-size: 26px; font-weight: 700; color: #67C23A; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.table-card { border-radius: 8px; }
</style>
