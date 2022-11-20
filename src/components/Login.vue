<template>
  <v-container class="fill-height pa-10">
    <v-responsive class="d-flex align-center text-center fill-height">

      <v-img height="100" src="../src/assets/logo.png" />

      <span class="text--secondary">Everything has a place and a purpose</span>

      <v-btn class="mt-10" block color="#3b5998" prepend-icon="mdi-google" variant="outlined" @click="auth('google')">
        Continue with Google
      </v-btn>

      <v-btn class="mt-3" block color="#3b5998" prepend-icon="mdi-facebook" variant="outlined" @click="auth('facebook')">
        Continue with Facebook
      </v-btn>

      <v-btn class="mt-3" block color="#3b5998" prepend-icon="mdi-twitter" variant="outlined" @click="auth('twitter')">
        Continue with Twitter
      </v-btn>

    </v-responsive>

    <v-snackbar v-model="error" timeout="5000">
      {{ error }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const error = ref(null)
const store = useStore()
const router = useRouter()

const auth = async (provider) => {
  try {
    await store.dispatch(provider)
    router.push('/')
  }
  catch (err) {
    error.value = err.message
  }
}
</script>
