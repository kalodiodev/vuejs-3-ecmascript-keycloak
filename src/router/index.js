import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import auth from '../auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { role: 'user' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.role)) {
    // this route requires authorization, check permissions
    auth.authorize(to.meta.role, () => next())
  } else {
    // this route does not require special handling
    next()
  }
})

export default router
