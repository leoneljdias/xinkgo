
<template>
  <div class="signin">
    <div class="text-center">
      <v-layout justify-center align-center>
        <span class="text-h6 text--secondary">
          <v-img src="@/assets/img/logo.png" width="210" />

        </span>
      </v-layout>
    </div>
    <span class="text--secondary">Everything has a place and a purpose</span>
    <div class="mt-10">
      <v-btn class="mb-3" width="100%" outlined @click="google">
        <v-icon left>
          mdi-google
        </v-icon>
        Continue with Google
      </v-btn>

      <v-btn class="mb-3" width="100%" color="#3b5998" dark depressed @click="facebook">
        <v-icon left>
          mdi-facebook
        </v-icon>
        Continue with Facebook
      </v-btn>
    </div>
    <span class="text--secondary">or</span>
    <v-form ref="form" class="text-left">
      <label class="font-weight-bold">Email:</label>
      <v-text-field v-model="email" class="mb-2" name="email" type="text" hide-details="auto" solo outlined flat
        dense />

      <label class="font-weight-bold">Password:</label>
      <v-text-field v-model="password" class="mb-5" :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        name="password" placeholder="" :type="show ? 'input' : 'password'" hide-details="auto" solo outlined flat dense
        @click:append="show = !show" />

      <v-btn class="mt-3" width="100%" color="primary" depressed @click="login">
        {{ $vuetify.lang.t('$vuetify.auth.sign-in.login') }}
      </v-btn>

      <div class="d-flex justify-space-between">
        <v-btn class="text-none letter-spacing-0 pa-0" text color="primary" @click="$router.push({ name: 'signup' })">
          {{ $vuetify.lang.t('$vuetify.auth.sign-in.create-account') }}
        </v-btn>

        <v-btn class="text-none letter-spacing-0 pa-0" text color="primary" @click="$router.push({ name: 'forgotpassword' })">
          {{ $vuetify.lang.t('$vuetify.auth.sign-in.forgot-password') }} ?
        </v-btn>
      </div>
    </v-form>
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
    errorCode: null,
    errorMessage: null,
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider(),
    user: null
  }),

  mounted () {
    this.email = this.$route.query.email ?? ''
  },
  methods: {
    login: function () {
      this.errorCode = null
      this.errorMessage = null
      this.$store.commit('setLoading', true)

      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          // Signed in
          this.user = userCredential.user
          this.$store.commit('setLoading', false)

          if (this.user.email && !this.user.emailVerified) {
            this.$store.commit('setAlert', { open: true, code: true, msg: `"${this.user.email}" needs to be verified before access is granted` })
          } else {
            this.$router.push('/main/nearby')
          }
        })
        .catch((error) => {
          this.$store.commit('setAlert', { open: true, code: error.code, msg: error.message })
          this.$store.commit('setLoading', false)
        })
    },

    google: function () {
      this.errorCode = null
      this.errorMessage = null
      this.$store.commit('setLoading', true)
      firebase.auth()
        .signInWithPopup(this.googleProvider)
        .then((userCredential) => {
          // Signed in
          this.user = userCredential.user
          this.$store.commit('setLoading', false)
          this.$router.push('/main/nearby')
        })
        .catch((error) => {
          this.$store.commit('setAlert', { open: true, code: error.code, msg: error.message })
          this.$store.commit('setLoading', false)
        })
    },

    facebook: function () {
      this.errorCode = null
      this.errorMessage = null
      this.$store.commit('setLoading', true)
      firebase.auth()
        .signInWithPopup(this.facebookProvider)
        .then((userCredential) => {
          // Signed in
          this.user = userCredential.user
          this.$store.commit('setLoading', false)
          this.$router.push('/main/nearby')
        })
        .catch((error) => {
          this.$store.commit('setAlert', { open: true, code: error.code, msg: error.message })
          this.$store.commit('setLoading', false)
        })
    }
  }
}
</script>
<style >
label.theme--dark+input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: #fff !important;
  /* inherit only works in Safari */
  -webkit-text-size-adjust: inherit !important;
}

label.theme--light+input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: #000 !important;
  /* inherit only works in Safari */
  -webkit-text-size-adjust: inherit !important;
}

/* When dark theme, then make keychain icon white */
label.theme--dark+input::-webkit-credentials-auto-fill-button {
  background-color: #fff !important;
}

/* Hide credentials-auto-fill-button in password inputs, only visible on other inputs */
input[type=password]::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 50px white inset;
  /* Change the color to your own background color */
  -webkit-text-fill-color: #333;
}

input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 50px white inset;
  /*your box-shadow*/
  -webkit-text-fill-color: #333;
}
</style>
