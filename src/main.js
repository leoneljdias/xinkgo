import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './plugins/vuex'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/app'

import '@/styles/styles.scss'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}

Vue.config.productionTip = false

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => {
  new Vue({
    router,
    store,
    vuetify,
    firebase,
    render: h => h(App)
  }).$mount('#app')
})
