<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script setup>
import { getAuth } from "firebase/auth";
import { useStore } from 'vuex'

const auth = getAuth();
const store = useStore();

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('user/UPDATE_DATA', user)
  } else {
    store.dispatch('user/LOGGOUT')
  }
});
</script>
