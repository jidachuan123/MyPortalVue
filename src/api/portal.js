import request from './request'

/** 登录：POST /consumer/auth/login */
export function login(data) {
  return request.post('/consumer/auth/login', data)
}

/** 获取当前登录用户信息 */
export function getMe() {
  return request.get('/consumer/portal/me')
}

/** 生成 SSO 一次性票据（进入子系统前调用，appCode 指定目标子系统编码） */
export function createSsoTicket(appCode) {
  return request.post('/consumer/portal/sso-ticket', { appCode })
}

/** 子系统验证票据（模拟子系统回调） */
export function validateTicket(ticket) {
  return request.get('/consumer/portal/validate-ticket', {
    params: { ticket }
  })
}

/** 子系统配置列表 */
export function getSubsystems() {
  return request.get('/consumer/portal/subsystems')
}

/** 登出 */
export function logout() {
  return request.post('/consumer/auth/logout')
}
