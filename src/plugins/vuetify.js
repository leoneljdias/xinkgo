import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import en from '../locale/en'
import Meta from 'vue-meta'

Vue.use(Vuetify)

Vue.use(Meta)

Vue.component('signin', {
  methods: {
    changeLocale () {
      this.$vuetify.lang.current = 'en'
    }
  }
})

export default new Vuetify({
  lang: {
    locales: { en },
    current: 'en'
  },
  theme: {
    themes: {
      light: {
        primary: '#e84e36' // #E53935
      }
    }
  }
})
