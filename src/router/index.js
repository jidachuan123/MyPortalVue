import { createRouter, createWebHistory } from 'vue-router'
import Portal from '../views/Portal.vue'

const routes = [
  {
    path: '/',
    name: 'Portal',
    component: Portal,
    meta: { title: '佳和商业供应链门户', public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 无登录态（门户已改为公开落地页），仅维护页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '佳和商业供应链门户'
  next()
})

export default router
