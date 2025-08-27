import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue')
  },
  {
    path: '/visualizador',
    name: 'Visualizador',
    component: () => import('@/views/VisualizadorView.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 