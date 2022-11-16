<template>
  <v-app>
    <v-progress-linear v-if="loading" indeterminate height="10" color="#e84e36" />
    <v-snackbar v-model="alert.open" top timeout="5000" dark>
      {{ alert.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="alert.open = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  metaInfo: {
    // Children can override the title.
    title: 'XINKGO',
    // Result: My Page Title ← My Site
    // If a child changes the title to "My Other Page Title",
    // it will become: My Other Page Title ← My Site
    titleTemplate: 'XINKGO',
    // Define meta tags here.
    meta: [

      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Everything has a place and a purpose' },

      { property: 'og:title', content: 'XINKGO' },
      { property: 'og:site_name', content: 'www.xinkgo.com' },
      // The list of types is available here: http://ogp.me/#types
      { property: 'og:type', content: 'website' },
      // Should the the same as your canonical link, see below.
      { property: 'og:url', content: 'https://www.xinkgo.com/' },
      { property: 'og:image', content: 'https://www.xinkgo.com/logo.png' },
      // Often the same as your meta description, but not always.
      { property: 'og:description', content: 'I have things here on my site.' },

      // Twitter card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: 'https://www.xinkgo.com/' },
      { name: 'twitter:title', content: 'XINKGO' },
      { name: 'twitter:description', content: 'Everything has a place and a purpose' },
      // Your twitter handle, if you have one.
      { name: 'twitter:creator', content: '@alligatorio' },
      { name: 'twitter:image:src', content: 'https://www.xinkgo.com/logo.png' },

      // Google / Schema.org markup:
      { itemprop: 'name', content: 'XINKGO' },
      { itemprop: 'description', content: 'Everything has a place and a purpose' },
      { itemprop: 'image', content: 'https://www.xinkgo.com/logo.png' }
    ]
  },

  components: {

  },

  data: () => ({
    //
  }),
  computed: {
    loading() {
      return this.$store.state.loading
    },
    alert: {
      get() {
        return this.$store.state.alert
      },
      set(val) {
        this.$store.commit('setAlert', val)
      }
    }
  }
}
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: whitesmoke;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
