import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import MainMap from '@/views/MapView.vue'
import SignUpView from '@/views/SignUpView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import NewEditMapView from '@/views/NewEditMapView.vue'
import NewEditLayerView from '@/views/NewEditLayerView.vue'
import FeaturesTableView from '@/views/FeaturesTableView.vue'
import LayerStylesView from '@/views/LayerStylesView.vue'

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
      {
        path: 'newlayer',
        name: 'newlayer',
        component: NewEditLayerView,
      },
      {
        path: 'editlayer/:idLayer',
        name: 'editlayer',
        component: NewEditLayerView,
      },
      {
        path: 'featurestable/:idLayer',
        name: 'featurestable',
        component: FeaturesTableView,
      },
      {
        path: 'layerstyles/:idLayer',
        name: 'layerstyles',
        component: LayerStylesView,
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
