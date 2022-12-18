<template>
  <v-snackbar v-model="error" v-if="error != false">
    {{ getErrorMessage(error.code) }}
  </v-snackbar>
  <v-main>
    <v-container class="fill-height pa-10 text-center" fluid>
      <v-responsive class="mx-auto align-center text-center fill-height" max-width="400">

        <v-img height="100" class="mb-2" :src="logoUrl" />

        <span class="text-medium-emphasis">Everything has a place and a purpose</span>

        <v-form v-model="form" @submit.prevent="onSubmit" class="mt-5">
          <p>
            <v-text-field v-model="email" :rules="[required]" variant="outlined" width="100%" label="Email" hide-details
              density="compact" class="mt-5"></v-text-field>
          </p>

          <p>
            <v-text-field v-model="password" type="password" :rules="[required]" variant="outlined" width="100%" label="Password"
              hide-details density="compact" class="mt-4"></v-text-field>
          </p>

          <p>
            <v-btn :disabled="!form" :loading="loading" width="100%" type="submit" variant="tonal" class="mt-4">Sign In</v-btn>
          </p>

        </v-form>

        <p>
          <v-btn height="auto" color="black" class="text-caption ma-0 pa-0 mt-3" variant="text" @click="register">
            No account yet?
          </v-btn>
        </p>


        <v-divider class="ma-5"></v-divider>

        <p>
          <v-btn class="mb-3" width="100%" prepend-icon="mdi-google" dark variant="flat" color="blue"
            @click="auth('google')">
            Continue with Google
          </v-btn>
        </p>

        <p>
          <v-btn class="mb-3" width="100%" prepend-icon="mdi-facebook" dark variant="flat" color="indigo darken-1"
            @click="auth('facebook')">
            Continue with Facebook
          </v-btn>
        </p>

        <v-col class="text-caption pa-0 ma-0 pt-1" style="line-height: 1.5">
          Click "Sign In" or "Continue with" to agree to XINKGO's <v-btn height="auto" color="black" class="text-caption ma-0 pa-0"
            variant="text" @click="openTermsOfService = true">Terms of Service</v-btn> and
          <v-btn height="auto" color="black" class="text-caption ma-0 pa-0" variant="text"
            @click="openPrivacyPolice = true">
            Privacy Police</v-btn>
        </v-col>

      </v-responsive>

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
    </v-container>
  </v-main>
  <v-footer class="pa-0 text-center">
    <v-col class="text-caption pa-0 ma-0" style="line-height: 1.5; position: absolute; bottom: 5px;">
      <p class="text-caption text-disabled text-center">Copyright © 2022 XINKGO. All Rights Reserved</p>
    </v-col>
  </v-footer>

</template>

<script>
import errors from '@/errors.json'
import Terms from '@/components/Terms'
import Police from '@/components/Police'
import logoUrl from '@/assets/logo.png'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components:
  {
    Terms,
    Police
  },
  setup() {
    const router = useRouter()

    const openTermsOfService = ref(false)
    const openPrivacyPolice = ref(false)

    function pushTo(route) { router.push(route) }

    return {
      openTermsOfService,
      openPrivacyPolice,
      logoUrl,
      pushTo
    }
  },
  data: () => ({
    form: false,
    email: null,
    password: null,
    loading: false,
    error: false
  }),

  methods: {
    onSubmit() {
      if (!this.form) return

      this.loading = true
      this.error = false

      this.$store.dispatch('user/SIGNIN', { email: this.email, password: this.password })
        .then(() => { this.pushTo("/main/map") })
        .catch((error) => { this.loading = false; this.error = error; });

    },
    required(v) {
      return !!v || 'Field is required'
    },
    auth(provider) {

      this.$store.dispatch('user/LOGIN', provider)
        .then(() => { this.pushTo("/main/map") })
        .catch((error) => { this.error = error; });
    },
    register() {
      this.pushTo('/auth/register')
    },
    getErrorMessage(code) {
      return errors[code];
    },
  },
}

</script>
