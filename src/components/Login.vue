<template>
  <v-main>
    <v-container class="fill-height pa-10">
      <v-responsive class="d-flex align-center text-center fill-height">

        <v-img height="100" :src="logoUrl" />

        <span class="text-medium-emphasis">Everything has a place and a purpose</span>

        <p>
          <v-btn class="mt-10" width="100%" max-width="400" prepend-icon="mdi-google" variant="outlined" @click="auth('google')">
            Continue with Google
          </v-btn>
        </p>

        <p>
          <v-btn class="mt-3" width="100%" max-width="400" prepend-icon="mdi-facebook" variant="outlined"
            @click="auth('facebook')">
            Continue with Facebook
          </v-btn>
        </p>

        <p style="display:none">
          <v-btn class="mt-3" width="100%" max-width="400" prepend-icon="mdi-twitter" variant="outlined"
            @click="auth('twitter')">
            Continue with Twitter
          </v-btn>
        </p>

      </v-responsive>

      <v-snackbar v-model="error" timeout="5000">
        {{ error }}
      </v-snackbar>
    </v-container>

    <v-dialog v-model="openTermsOfService" scrollable transition="dialog-bottom-transition">
      <v-card>
        <v-card-title>Terms of Service</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 80vh">
          <Terms />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="openTermsOfService = false">
            Ok
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="openPrivacyPolice" scrollable transition="dialog-bottom-transition">
      <v-card>
        <v-card-title>Privacy Police</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 80vh">
          <Police />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="openPrivacyPolice = false">
            Ok
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>

  <v-snackbar dark v-model="showCookies">
    We use cookies and other tracking technologies to improve your browsing experience on our website
    <template v-slot:actions>
      <v-btn variant="text" @click="acceptCookies">Ok</v-btn>
    </template>
  </v-snackbar>

  <v-footer class="pa-0" absolute>
    <v-col class="text-caption text-center" style="line-height: 1.5">
      Click "Continue with" to agree to XINKGO's <v-btn height="auto" color="black" class="text-caption ma-0 pa-0"
        variant="text" @click="openTermsOfService = true">Terms of Service</v-btn> and acknowledge that XINKGO's <v-btn
        height="auto" color="black" class="text-caption ma-0 pa-0" variant="text" @click="openPrivacyPolice = true">
        Privacy Police</v-btn> applies to you
    </v-col>
  </v-footer>
  <span class="text-caption text-disabled text-center pb-5">Copyright © 2022 XINKGO. All Rights Reserved</span>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Terms from '@/components/Terms'
import Police from '@/components/Police'

const openTermsOfService = ref(false)
const openPrivacyPolice = ref(false)

const error = ref(null)
const store = useStore()
const router = useRouter()

import logoUrl from '@/assets/logo.png'

const auth = async (provider) => {
  try {
    await store.dispatch('user/' + provider)
    router.push('/')
  }
  catch (err) {
    error.value = err.message
  }
}

const acceptCookies = async () => {
  await store.dispatch('user/setAcceptCookies', true)
}

const showCookies = computed(() => store.state.user.acceptCookies == false)

</script>
