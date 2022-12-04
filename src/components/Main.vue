<template>
  <v-container class="fill-height pa-0 main">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath"></component>
      </keep-alive>
    </router-view>

    <v-bottom-navigation grow fixed v-model="menu" color="red">
      <v-btn value="map">
        <v-icon>mdi-map-marker</v-icon>
        Map
      </v-btn>

      <v-btn value="feed">
        <v-icon>mdi-history</v-icon>
        Users
      </v-btn>

      <v-btn value="profile">
        <v-icon>mdi-face-man</v-icon>
        Profile
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  data: () => ({ menu: 'map' }),
  setup() {
    const store = useStore()
    const router = useRouter();

    function pushTo(route) { router.push({ name: route }) }

    return {
      user: computed(() => store.state.user.data),
      pushTo
    }
  },
  mounted()
  {
    this.menu = this.$route.name;
  },
  watch: {
    $route (to){
      this.menu = to.name;
    },
    menu(newValue, oldValue) {
      if(newValue != oldValue)
        this.pushTo(newValue);
    }
  },
}

</script>

<style scoped>
.main {
  max-width: 100%;
}
</style>
