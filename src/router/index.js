import {
  createWebHistory,
  createRouter
} from "vue-router";

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth'

const Login = () => import('@/components/Login')
const Main = () => import('@/components/Main')
const Map = () => import('@/components/Map')

const routes = [{
  path: '/',
  redirect: '/main/map'
}, {
  path: '/auth',
  children: [{
    path: 'login',
    component: Login,
    name: 'login'
  }]
}, {
  path: '/main',
  component: Main,
  name: 'main',
  meta: {
    requiresAuth: true
  },
  children: [{
    path: 'map',
    name: 'map',
    component: Map
  }]
}]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !user) {
      next('/auth/login')
    }
    next()
  });
})

export default router
