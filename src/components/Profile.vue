<template>
  <v-btn @click="logOut">Logout</v-btn>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const logOut = async () => {
  await store.dispatch('people/unsubscribe')
  await store.dispatch('user/logOut')
  router.push('/')
}
</script>

<style>
</style>
