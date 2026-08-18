<template>
  <div class="sub-page">
    <header class="sub-header">
      <div class="header-left">
        <div class="logo" style="background:#E6A23C">C</div>
        <span class="app-name">子系统C · 外部对接系统</span>
      </div>
      <div class="header-right">
        <el-tag v-if="ssoState === 'success'" type="success" effect="dark">
          ✓ SSO 已认证（{{ ssoUser?.realName || ssoUser?.username }}）
        </el-tag>
        <el-tag v-else-if="ssoState === 'loading'" type="info" effect="dark">票据验证中...</el-tag>
        <el-tag v-else type="danger" effect="dark">✗ 未认证</el-tag>
        <el-button size="small" type="warning" plain @click="goPortal">返回门户</el-button>
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
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">1,024</div><div class="stat-label">今日调用</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">99.2%</div><div class="stat-label">成功率</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">15</div><div class="stat-label">对接方</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">2</div><div class="stat-label">异常告警</div></div></el-card></el-col>
        </el-row>

        <el-card shadow="never" class="table-card">
          <template #header><b>接口调用日志（模拟数据）</b></template>
          <el-table :data="logs" size="small" stripe>
            <el-table-column prop="time" label="时间" width="160" />
            <el-table-column prop="api" label="接口" />
            <el-table-column prop="partner" label="对接方" width="140" />
            <el-table-column prop="method" label="方法" width="80" />
            <el-table-column label="结果" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === '成功' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag>
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

const logs = [
  { time: '2026-08-12 15:20:11', api: '/api/goods/query', partner: '供应商平台', method: 'POST', status: '成功' },
  { time: '2026-08-12 15:18:02', api: '/api/order/push', partner: '物流系统', method: 'POST', status: '成功' },
  { time: '2026-08-12 15:12:45', api: '/api/inventory/sync', partner: '仓储系统', method: 'PUT', status: '失败' },
  { time: '2026-08-12 15:05:33', api: '/api/price/query', partner: '价格中心', method: 'GET', status: '成功' }
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
.stat-num { font-size: 26px; font-weight: 700; color: #E6A23C; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.table-card { border-radius: 8px; }
</style>
