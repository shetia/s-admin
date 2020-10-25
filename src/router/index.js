import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/list.vue')
  },
  {
    path: '/detail/:type',
    name: 'detail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/detail.vue')
  },
  {
    path: '/bigFile',
    name: 'bigFile',
    component: () => import('../views/bigFile.vue')
  },
  {
    path: '/cardList',
    name: 'cardList',
    component: () => import('../views/cardList.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue')
  },
  {
    path: '/testG2',
    name: 'testG2',
    component: () => import('../views/testG2.vue')
  },
  {
    path: '/orgTree',
    name: 'orgTree',
    component: () => import('../views/orgTree.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
