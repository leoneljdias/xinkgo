import Vue from 'vue'
import VueRouter from 'vue-router'

import firebase from 'firebase/app'
import 'firebase/auth'

const Auth = () => import('@/views/Auth/Auth')
const Signin = () => import('@/views/Auth/Signin')
const Signup = () => import('@/views/Auth/Signup')
const Checkemail = () => import('@/views/Auth/Checkemail')
const Forgotpassword = () => import('@/views/Auth/Forgotpassword')
const Sendpasswordresetemail = () => import('@/views/Auth/Sendpasswordresetemail')
const Main = () => import('@/views/Main/Main')
const Nearbyview = () => import('@/views/Main/Nearbyview')
const Favoritesview = () => import('@/views/Main/Favoritesview')
const Recentsview = () => import('@/views/Main/Recentsview')
const ProfileView = () => import('@/views/Main/ProfileView')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/main/nearby'
}, {
  path: '/auth',
  component: Auth,
  children: [{
    path: 'signin',
    component: Signin,
    name: 'signin'
  }, {
    path: 'signup',
    component: Signup,
    name: 'signup'
  }, {
    path: 'checkemail',
    component: Checkemail,
    name: 'checkemail'
  }, {
    path: 'forgotpassword',
    component: Forgotpassword,
    name: 'forgotpassword'
  }, {
    path: 'Sendpasswordresetemail',
    component: Sendpasswordresetemail,
    name: 'Sendpasswordresetemail'
  }]
}, {
  path: '/main',
  component: Main,
  name: 'main',
  meta: {
    requiresAuth: true
  },
  children: [{
    path: 'nearby',
    name: 'nearby',
    component: Nearbyview
  },
  {
    path: 'favorites',
    name: 'favorites',
    component: Favoritesview
  },
  {
    path: 'recents',
    name: 'recents',
    component: Recentsview
  },
  {
    path: 'profile',
    name: 'profile',
    component: ProfileView
  }
  ]
}]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) {
    next('/auth/signin')
  }
  next()
})

export default router
