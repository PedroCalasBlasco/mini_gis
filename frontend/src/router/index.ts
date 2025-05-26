import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import MainMap from '@/views/MapView.vue'
import SignUpView from '@/views/SignUpView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import NewEditMapView from '@/views/NewEditMapView.vue'

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
    path: '/dashboard/:userId',
    component: DashboardLayout, // AQUI está el layout compartido
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView,
      },
      {
        path: 'newmap',
        name: 'newmap',
        component: NewEditMapView,
      },
      {
        path: 'editmap/:idMap',
        name: 'editmap',
        component: NewEditMapView,
      },
      {
        path: 'map/:mapid',
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
