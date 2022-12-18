<template>
  <v-snackbar v-model="error" v-if="error != false">
    {{ getErrorMessage(error.code) }}
  </v-snackbar>
  <v-main>
    <v-container class="fill-height pa-10 text-center" fluid>
      <v-responsive class="mx-auto align-center text-center fill-height" max-width="400">

        <v-img height="100" :src="logoUrl" />

        <span class="h6">Create an account</span>

        <v-form v-model="form" @submit.prevent="onSubmit">

          <p>
            <v-text-field v-model="email" :readonly="loading" :rules="[required]" variant="outlined" width="100%"
              max-width="400" label="Email" hide-details density="compact" class="mt-5"></v-text-field>
          </p>

          <p>
            <v-text-field v-model="password" type="password" :readonly="loading" :rules="[required]" variant="outlined"
              width="100%" max-width="400" label="Password" hide-details density="compact" class="mt-6"></v-text-field>
          </p>

          <password-meter :password="password" />

          <p>
            <v-text-field v-model="confirmPassword" type="password" :readonly="loading" :rules="[required]"
              variant="outlined" width="100%" max-width="400" label="Confirm your password" hide-details
              density="compact" class="mt-3"></v-text-field>
          </p>

          <p>
            <v-btn :disabled="!form" :loading="loading" width="100%" max-width="400" type="submit" variant="tonal"
              class="mt-6">Sign Up</v-btn>
          </p>

          <v-btn height="auto" color="black" class="text-caption ma-0 pa-0 mt-3" variant="text"
            @click="pushTo('/auth/login')">
            Already have an account?
          </v-btn>

        </v-form>


        <v-col class="text-caption pa-0 ma-0 pt-1 mt-10" style="line-height: 1.5">
          Click "Sign Up" to agree to XINKGO's <v-btn height="auto" color="black" class="text-caption ma-0 pa-0"
            variant="text" @click="openTermsOfService = true">Terms of Service</v-btn>
          and
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
import logoUrl from '@/assets/logo.png'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PasswordMeter from 'vue-simple-password-meter';
import Terms from '@/components/Terms'
import Police from '@/components/Police'

export default {
  components: {
    PasswordMeter,
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
    confirmPassword: null,
    loading: false,
    score: 0,
    error: false
  }),
  methods: {
    onSubmit() {
      if (!this.form) return

      this.loading = true
      this.error = false

      if (this.match_check()) {
        this.loading = false;
        return;
      }

      this.$store.dispatch('user/REGISTER', { email: this.email, password: this.password })
        .then(() => { this.pushTo('/auth/emailVerification') })
        .catch((error) => { this.loading = false; this.error = error; });

    },
    required(v) {
      return !!v || 'Field is required'
    },
    match_check() {
      if (this.password !== this.confirmPassword) this.error = { code: "xinkgo/password-match" };
      return this.password !== this.confirmPassword
    },
    getErrorMessage(code) {
      return errors[code];
    },
  },
}

</script>
