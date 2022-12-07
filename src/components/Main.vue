<template>
  <v-app-bar density="compact" app>

    <template v-slot:prepend>
      <v-avatar size="small">
        <v-img :src="user.photoURL" v-if="user" @click="(openSidebar = !openSidebar)"></v-img>
      </v-avatar>
    </template>

    <template v-slot:title>
      <div class="center-title"><img height="30" style="margin-top: 10px;" :src="logoUrl" /></div>
    </template>

    <template v-slot:append>
      <v-icon size="large" @click="(newDialogOpen = !newDialogOpen)">mdi-flag-plus</v-icon>
    </template>

  </v-app-bar>

  <New v-model="newDialogOpen" v-if="newDialogOpen"></New>

  <v-navigation-drawer v-model="openSidebar" app clipped absolute temporary v-if="user">
    <template v-slot:prepend>
      <v-list-item lines="two" :prepend-avatar="user.photoURL" :title="user.displayName"
        subtitle="Logged in"></v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item prepend-icon="mdi-account" title="My Account" @click="value = 'profile'"></v-list-item>
      <v-list-item prepend-icon="mdi-logout" title="Sign Out" @click="logOut"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <v-container class="fill-height pa-0 main">

      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath"></component>
        </keep-alive>
      </router-view>

    </v-container>
  </v-main>

  <v-bottom-navigation grow app v-model="menu" density="compact" color="red">
    <v-btn value="map">
      <v-icon size="large">mdi-map-marker</v-icon>
    </v-btn>

    <v-btn value="feed">
      <v-icon size="large">mdi-history</v-icon>
    </v-btn>

    <v-btn value="profile">
      <v-icon size="large">mdi-face-man</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import logoUrl from '@/assets/logo.png'

import New from '@/components/New';

export default {
  components:
  {
    New
  },
  data: () => ({
    menu: 'map',
    openSidebar: false,
    newDialogOpen: false
  }),
  setup() {
    const store = useStore()
    const router = useRouter();

    const pushTo = async (route) => {
      router.push({ name: route })
    };

    const logOut = async () => {
      await store.dispatch('user/LOGGOUT')
      router.push('/')
      return
    };

    return {
      user: computed(() => store.state.user.data),
      pushTo,
      logOut,
      logoUrl
    }
  },
  mounted() {
    this.menu = this.$route.name;
  },
  watch: {
    $route(to) {
      this.menu = to.name;
    },
    menu(newValue, oldValue) {
      if (newValue != oldValue)
        this.pushTo(newValue);
    }
  }
}

</script>

<style>
.v-navigation-drawer {
  will-change: initial !important
}

.center-title {
  margin-left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
}
</style>
