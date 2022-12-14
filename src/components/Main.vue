<template>
  <v-app-bar app>

    <template v-slot:prepend>
      <img height="30" :src="logoUrl" @click="(openSidebar = !openSidebar)" />
    </template>

    <template v-slot:append>
      <v-icon size="large" @click="(newDialogOpen = !newDialogOpen)">mdi-plus</v-icon>
    </template>

  </v-app-bar>

  <New v-model="newDialogOpen" v-if="newDialogOpen"></New>

  <v-navigation-drawer v-model="openSidebar" app clipped absolute temporary v-if="user">
    <template v-slot:prepend>
      <v-list-item lines="two" :prepend-avatar="user.photoURL ?? photoUrl" :title="user.displayName ?? user.email.split('@')[1]"
        subtitle="Logged in"></v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item prepend-icon="mdi-logout" title="Sign Out" @click="logOut"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <v-container class="fill-height pa-0 main">
      <v-progress-linear indeterminate color="red" v-if="isLoading"></v-progress-linear>
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath"></component>
      </router-view>

    </v-container>
  </v-main>

  <v-bottom-navigation grow app v-model="menu" color="red">
    <v-btn value="map">
      <v-icon size="large">mdi-map-marker</v-icon>Map
    </v-btn>

    <v-btn value="feed">
      <v-icon size="large">mdi-history</v-icon>Feed
    </v-btn>

    <v-btn value="profile">
      <v-icon size="large">mdi-face-man</v-icon>Profile
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import logoUrl from '@/assets/logo.png'
import photoUrl from '@/assets/user.png'

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
      store.dispatch('user/LOGGOUT')
      router.push('/auth/login')
      return
    };

    return {
      pushTo,
      logOut,
      photoUrl,
      logoUrl
    }
  },
  computed:
  {
    isLoading() {
      return this.$store.state.event.isLoading;
    },
    user() {
      return this.$store.state.user.data;
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
      if (newValue != oldValue) {
        this.pushTo(newValue);
      }
    }
  }
}

</script>

<style>
.v-navigation-drawer {
  will-change: initial !important
}

.xMarker {
  background-repeat: no-repeat;
  background-size: contain;
  background: transparent;
  overflow: hidden;
  width: 32px;
  height: 32px;
}

.v-container
{
  max-width: 100%;
}

</style>
