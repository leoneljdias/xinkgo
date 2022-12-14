<template>
  <v-main>
    <v-container class="fill-height pa-10 text-center" fluid>
      <v-responsive class="mx-auto align-center text-center fill-height" max-width="400">

        <v-img height="100" :src="logoUrl" />

        <p class="mb-5">Welcome!</p>

        <span class="text-medium-emphasis mt-5">We sent an email to {{user.email}} to make sure you own it. Please check your inbox! <br/><br/>If you did not receive a verification email, check your Spam or Junk email folders</span>

        <p>
          <v-btn  width="100%" max-width="400" type="submit" variant="tonal" class="mt-6" @click="pushTo('/auth/login')">Login</v-btn>
        </p>

      </v-responsive>

    </v-container>
  </v-main>
  <v-footer class="pa-0 text-center">
    <v-col class="text-caption pa-0 ma-0" style="line-height: 1.5">
      <p class="text-caption text-disabled text-center">Copyright © 2022 XINKGO. All Rights Reserved</p>
    </v-col>
  </v-footer>

</template>

<script>
import logoUrl from '@/assets/logo.png'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    function pushTo(route) { router.push(route) }

    return {
      logoUrl,
      pushTo
    }
  },
  computed:
  {
    user() {
      return this.$store.state.user.data;
    }
  }
}

</script>
