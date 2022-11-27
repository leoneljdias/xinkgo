/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import firebase from './firebase'
import store from '@/store/index'
import router from '@/router/index'
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';

export function registerPlugins (app) {
  loadFonts()
  app.use(firebase)
  app.use(vuetify)
  app.use(store)
  app.use(router)
  // Setup plugin for defaults or `$screens` (optional)
  app.use(SetupCalendar, {})

  // Use the components
  app.component('Calendar', Calendar)
  app.component('DatePicker', DatePicker)
}
