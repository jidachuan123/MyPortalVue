import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    name: 'Portal',
    component: () => import('../views/Portal.vue'),
    meta: { title: '企业门户', public: false }
  },
  {
    path: '/sub/a',
    name: 'SubA',
    component: () => import('../views/subsystem/SubA.vue'),
    meta: { title: '子系统A-报表系统', public: false }
  },
  {
    path: '/sub/b',
    name: 'SubB',
    component: () => import('../views/subsystem/SubB.vue'),
    meta: { title: '子系统B-商品系统', public: false }
  },
  {
    path: '/sub/c',
    name: 'SubC',
    component: () => import('../views/subsystem/SubC.vue'),
    meta: { title: '子系统C-对接系统', public: false }
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

// 全局守卫：未登录跳转登录页
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 企业门户` : '企业门户'
  const token = localStorage.getItem('portal_token')
  if (!to.meta.public && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
