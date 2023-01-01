<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script setup>
import { getAuth } from "firebase/auth";
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const auth = getAuth();
const store = useStore();
const router = useRouter();

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('user/GET_DATA', user).then(() => { router.push("/main/map") });
  } else {
    store.dispatch('user/LOGGOUT')
    router.push('/auth/login')
  }
});
</script>

<style>

</style>
