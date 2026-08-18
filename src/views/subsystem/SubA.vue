<template>
  <div class="sub-page">
    <!-- 顶栏 -->
    <header class="sub-header">
      <div class="header-left">
        <div class="logo" style="background:#409EFF">A</div>
        <span class="app-name">子系统A · 报表查询系统</span>
      </div>
      <div class="header-right">
        <el-tag v-if="ssoState === 'success'" type="success" effect="dark">
          ✓ SSO 已认证（{{ ssoUser?.realName || ssoUser?.username }}）
        </el-tag>
        <el-tag v-else-if="ssoState === 'loading'" type="info" effect="dark">票据验证中...</el-tag>
        <el-tag v-else type="danger" effect="dark">✗ 未认证</el-tag>
        <el-button size="small" type="primary" plain @click="goPortal">返回门户</el-button>
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
      <!-- 模拟业务页面 -->
      <div class="page-container">
        <el-row :gutter="16" class="stat-row">
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">1,286</div><div class="stat-label">本月报表数</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">98.6%</div><div class="stat-label">数据准确率</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">42</div><div class="stat-label">活跃报表</div></div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover"><div class="stat"><div class="stat-num">7</div><div class="stat-label">待审批</div></div></el-card></el-col>
        </el-row>

        <el-card shadow="never" class="table-card">
          <template #header><b>最新报表列表（模拟数据）</b></template>
          <el-table :data="reports" size="small" stripe>
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="name" label="报表名称" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="owner" label="创建人" width="100" />
            <el-table-column prop="time" label="创建时间" width="160" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
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

const reports = [
  { id: 1, name: '华东区销售日报', type: '销售', owner: '张三', time: '2026-08-12 08:30', status: '已完成' },
  { id: 2, name: '华南区库存周报', type: '库存', owner: '李四', time: '2026-08-11 17:00', status: '已完成' },
  { id: 3, name: '全国退货分析月报', type: '售后', owner: '王五', time: '2026-08-10 09:15', status: '生成中' },
  { id: 4, name: '华北区毛利明细', type: '财务', owner: '赵六', time: '2026-08-09 14:40', status: '已完成' }
]

onMounted(async () => {
  // 模拟子系统A：从 URL 取 ticket 回调门户验证
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
.stat-num { font-size: 26px; font-weight: 700; color: #409EFF; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.table-card { border-radius: 8px; }
</style>
