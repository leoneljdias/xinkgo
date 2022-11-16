<template>
  <div>
    <div class="mb-4">
      <v-layout justify-center align-center>
        <span class="text-h6 text--secondary">
          <v-img src="@/assets/img/logo.png" width="210" style="vertical-align: middle;" />
        </span>
      </v-layout>
    </div>
    <h1 class="text-h6 mb-6">
      {{ $vuetify.lang.t('$vuetify.auth.sign-up.create') }}
    </h1>
    <v-form>
      <v-container class="pa-0 text-left">
        <label class="text-body-2 font-weight-bold">Email:</label>
        <v-text-field ref="input" v-model="email" class="mb-3" :label="$vuetify.lang.t('$vuetify.auth.sign-up.email')"
          name="email" type="text" hide-details="auto" solo outlined flat dense />

        <label class="text-body-2 font-weight-bold">Password:</label>
        <v-text-field ref="input" v-model="password" class="mb-3"
          :label="$vuetify.lang.t('$vuetify.auth.sign-up.password')"
          :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" name="password" placeholder=""
          :type="show ? 'input' : 'password'" hide-details="auto" solo outlined flat dense
          @click:append="show = !show" />

        <label class="text-body-2 font-weight-bold">Confirm password:</label>
        <v-text-field ref="input" v-model="confirmPassword" class="mb-3"
          :label="$vuetify.lang.t('$vuetify.auth.sign-up.confirm-password')"
          :append-icon="showConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" name="password" placeholder=""
          :type="showConfirm ? 'input' : 'password'" hide-details="auto" solo outlined flat dense
          @click:append="showConfirm = !showConfirm" />

      </v-container>
    </v-form>
    <div class="transition-wrapper">
      <div class="d-flex justify-space-between mt-8">
        <v-btn class="text-none letter-spacing-0" style="margin-left: -16px;" color="primary" text
          @click="$router.push({ name: 'signin' })">
          {{ $vuetify.lang.t('$vuetify.auth.sign-up.instead') }}
        </v-btn>
        <v-btn class="text-none letter-spacing-0" style="min-width: 88px;" color="primary" depressed
          @click="registerUser">
          {{ $vuetify.lang.t('$vuetify.auth.sign-up.done') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data: () => ({
    show: false,
    showConfirm: false,
    email: '',
    password: '',
    confirmPassword: '',
    errorMessage: null,
    errorCode: null,
    user: null
  }),

  methods: {
    async registerUser() {
      this.errorCode = null
      this.errorMessage = null
      this.$store.commit('setLoading', true)

      if (this.validatePassword()) {
        await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
            // Signed in
            this.user = userCredential.user
            const actionCodeSettings = {
              url: `${process.env.VUE_APP_HOST_NAME}/auth/signin/?email=${this.user.email}`
            }
            this.user.sendEmailVerification(actionCodeSettings).then(() => {
              this.$store.commit('setLoading', false)
              this.$router.push('/auth/checkemail/?email=' + this.user.email)
            }).catch((error) => {
              this.$store.commit('setAlert', { open: true, code: error.code, msg: error.message })
              this.$store.commit('setLoading', false)
            })
          })
          .catch((error) => {
            this.$store.commit('setAlert', { open: true, code: error.code, msg: error.message })
            this.$store.commit('setLoading', false)
          })
      } else {
        this.$store.commit('setAlert', { open: true, code: true, msg: 'Passwords does not match' })
        this.$store.commit('setLoading', false)
      }
    },
    validatePassword() {
      let isValid = true
      if (this.password !== this.confirmPassword) {
        isValid = false
      }
      return isValid
    }
  }
}
</script>
