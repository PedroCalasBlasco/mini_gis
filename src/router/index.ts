import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import MainMap from '@/views/MapView.vue'
import SignUpView from '@/views/SignUpView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/map',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'map',
        component: MainMap,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

function isAuthenticated(): boolean {
  return !!localStorage.getItem('token')
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
