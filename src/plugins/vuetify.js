/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'v-calendar/dist/style.css'
import 'maplibre-gl/dist/maplibre-gl.css';

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  ssr: true,
  theme: {
    defaultTheme: 'dark',
    dark: {
      primary: "#0F1829",
      secondary: "#112130",
    },
  },
})
