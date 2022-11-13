<template>
  <div>
    <div class="mb-4">
      <v-layout justify-center align-center>
        <span class="text-h6 text--secondary">
          <v-img src="@/assets/img/logo.png" width="210" style="vertical-align: middle;" />
        </span>
      </v-layout>
    </div>
    <h1 class="text-h5 mb-2">
      {{ $vuetify.lang.t('$vuetify.auth.sign-in.forgot-password') }}
    </h1>
    <div>
      <span class="text--secondary">{{ $vuetify.lang.t('$vuetify.auth.recoverpassword.message') }}</span>
    </div>
    <v-form>
      <v-container class="pa-0 text-left">
        <v-text-field ref="input" v-model="email" class="mt-3" :label="$vuetify.lang.t('$vuetify.auth.sign-up.email')"
          name="email" type="text" hide-details="auto" solo outlined flat dense />

        <v-alert v-if="errorCode" dense class="mt-3" border="top" color="red lighten-2" dark>
          {{ errorMessage }}
        </v-alert>
      </v-container>
    </v-form>
    <div class="transition-wrapper">
      <div class="d-flex justify-space-between mt-3">
        <v-btn class="text-none letter-spacing-0" style="min-width: 100%;" color="primary" depressed
          @click="recoverPassword">
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
    email: '',
    password: '',
    errorMessage: null,
    errorCode: null,
    user: null
  }),

  methods: {
    async recoverPassword () {
      this.errorCode = null
      this.errorMessage = null
      this.$store.commit('setLoading', true)

      const actionCodeSettings = {
        url: `${process.env.VUE_APP_HOST_NAME}/auth/signin/?email=${this.email}`
      }

      await firebase.auth()
        .sendPasswordResetEmail(this.email, actionCodeSettings)
        .then(() => {
          this.$store.commit('setLoading', false)
          this.$router.push('/auth/sendpasswordresetemail')
        })
        .catch((error) => {
          this.$store.commit('setLoading', false)
          this.errorCode = error.code
          this.errorMessage = error.message
        })
    }
  }
}
</script>
