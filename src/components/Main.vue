<template>
  <v-container class="fill-height pa-0 main">
    <router-view />
    <v-bottom-navigation grow v-model="state">
      <v-btn value="map">
        <v-icon>mdi-map-marker</v-icon>
        Map
      </v-btn>

      <!--v-btn value="feed">
        <v-icon>mdi-history</v-icon>
        Feed
      </v-btn-->

      <v-btn value="profile">
        <v-icon>mdi-face-man</v-icon>
        Profile
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const state = ref("people")
const store = useStore()
const router = useRouter()

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!!user) {
      store.dispatch("user/fetchUser", user)
      store.dispatch("people/subscribeChange", user)
    }
  });
});

watch(state, async (newState, oldState) => {
  router.push({ name: newState })
})
</script>

<style scoped>
.main {
  max-width: 100%;
}
</style>
