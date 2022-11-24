<template>
  <v-container class="fill-height pa-10" v-if="user">
    <div class="justify-center">

      <h3>Hello, {{ user.displayName }}!</h3>

      <v-avatar class="mt-3" tile style="width:100%; height: 100%; max-width: 400px; border-radius: 5px;">
        <img :src="user.photoURL" style="width:100%; border: 1px solid black; border-radius: 5px;">
      </v-avatar>

      <p>
        <v-btn class="mt-10" width="100%" max-width="400" prepend-icon="mdi-logout" variant="outlined" @click="logOut">
          Logout
        </v-btn>
      </p>

      <p>
        <v-btn class="mt-3" color="red" width="100%" max-width="400" prepend-icon="mdi-delete-outline"
          variant="outlined" @click="logOut">
          DELETE ACCOUNT
        </v-btn>
      </p>

    </div>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const logOut = async () => {
  await store.dispatch('people/unsubscribe')
  await store.dispatch('user/logOut')
  router.push('/')
}

const user = computed(() => store.state.user.data)


</script>

<style>

</style>
