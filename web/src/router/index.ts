import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
    { path: '/tasks', name: 'tasks', component: () => import('@/views/TaskListView.vue') },
    { path: '/tasks/new', name: 'task-new', component: () => import('@/views/TaskFormView.vue') },
    { path: '/tasks/:id(\\d+)', name: 'task-detail', component: () => import('@/views/TaskDetailView.vue') },
    { path: '/tasks/:id(\\d+)/edit', name: 'task-edit', component: () => import('@/views/TaskFormView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
})

export default router
