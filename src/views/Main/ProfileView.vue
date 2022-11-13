<template>
  <v-container v-if="user" class="viewpage ma-10">
    <h5 class="headline mb-5">
      Olá {{ user.email }}!
    </h5>
    <v-row>
      <v-btn class="mb-5" width="100%" @click="signOut">
        Sign out
      </v-btn>
    </v-row>
    <v-row>
      <v-btn class="mb-5" width="100%" color="red" dark @click="deleteUser">
        Delete account
      </v-btn>
      <div class="red--text">
        You'll lose all the data and content in that account
      </div>
    </v-row>
  </v-container>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/auth'

export default {

  data: () => ({
    user: firebase.auth().currentUser
  }),

  watch:
  {
  },

  methods: {
    signOut () {
      firebase.auth().signOut().then(() => {
        this.$router.push('/auth/signin')
      })
    },
    deleteUser () {
      this.user.delete().then(() => {
        this.$router.push('/auth/signin')
      })
    }
  }
}
</script>
