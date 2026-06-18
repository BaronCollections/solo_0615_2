import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/Layout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      component: Layout,
      redirect: '/classes',
      children: [
        {
          path: 'classes',
          name: 'Classes',
          component: () => import('../views/ClassManage.vue')
        },
        {
          path: 'courses',
          name: 'Courses',
          component: () => import('../views/CourseManage.vue')
        },
        {
          path: 'repairs',
          name: 'Repairs',
          component: () => import('../views/RepairManage.vue')
        },
        {
          path: 'leaves',
          name: 'Leaves',
          component: () => import('../views/LeaveApproval.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const user = localStorage.getItem('smart_campus_current_user')
  if (to.path !== '/login' && !user) {
    return '/login'
  }
  if (to.path === '/login' && user) {
    return '/'
  }
})

export default router
