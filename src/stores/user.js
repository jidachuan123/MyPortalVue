import { defineStore } from 'pinia'
import { login as apiLogin, getMe, logout as apiLogout } from '../api/portal'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('portal_token') || '',
    userInfo: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    realName: (state) => state.userInfo?.realName || ''
  },
  actions: {
    async login(username, password) {
      const res = await apiLogin({ username, password })
      const data = res.result
      this.token = data.token
      localStorage.setItem('portal_token', data.token)
      this.userInfo = {
        userId: data.userId,
        username: data.username,
        realName: data.realName || data.username,
        roles: data.roles || []
      }
      return this.userInfo
    },
    async fetchMe() {
      const res = await getMe()
      this.userInfo = res.result
      return this.userInfo
    },
    async logout() {
      try {
        await apiLogout()
      } catch (e) {
        // 忽略登出接口异常
      }
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('portal_token')
    }
  }
})
