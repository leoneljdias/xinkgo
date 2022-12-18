import {
  createWebHistory,
  createRouter
} from "vue-router";

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth'

const Login = () => import('@/components/Login')
const Register = () => import('@/components/Register')
const EmailVerification = () => import('@/components/EmailVerification')
const Main = () => import('@/components/Main')
const Map = () => import('@/components/Map')
const Feed = () => import('@/components/Feed')
const Events = () => import('@/components/Events')

const routes = [{
  path: '/',
  redirect: '/main/map'
}, {
  path: '/auth',
  children: [{
    path: 'login',
    component: Login,
    name: 'login'
  },{
    path: 'register',
    component: Register,
    name: 'register'
  },{
    path: 'emailVerification',
    component: EmailVerification,
    name: 'emailVerification'
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
    component: Map,
    meta: {
      noCache: true,
    },
  }, {
    path: 'feed',
    name: 'feed',
    component: Feed,
    meta: {
      noCache: true,
    },
  }, {
    path: 'events',
    name: 'events',
    component: Events,
  }]
}]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (currentUser) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !currentUser) {
      next('/auth/login');
    } else if (requiresAuth && !currentUser.emailVerified) {
      next('/auth/emailVerification');
    } else {
      next();
    }
  })
});

export default router
