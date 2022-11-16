<template>
  <div v-if="user" fluid class="ma-8 mt-0">
    <div class="justify-center">
      <div @click="launchFilePicker()">
        <div>
          <v-avatar v-if="!(photoData ?? user.photoURL)" v-ripple size="80" class="grey lighten-3 mb-3"
            style="border: 3px solid #e84e36;padding: 40px;">
            <span class="text-caption">Upload photo</span>
          </v-avatar>
          <v-avatar v-else v-ripple size="80" class="mb-3" style="border: 3px solid #e84e36;padding: 40px;">
            <img :src="photoData ?? user.photoURL" alt="avatar">
          </v-avatar>
        </div>
      </div>
      <v-file-input id="photoInput" v-model="imageFile" type="file" accept="image/*" style="display:none"
        @change="onFileChange" />
    </div>

    <v-dialog v-model="showCrop" persistent max-width="80vh" transition="dialog-bottom-transition">
      <v-card class="pa-0 ma-0" max-height="80vh">
        <v-toolbar dense color="white">
          <v-toolbar-title class="font-weight-bold" style="color:#e84e36">
            Crop your photo
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-0 ma-0" style="overflow: hidden;max-height:60vh">
          <vue-cropper ref="cropper" :key="newCropper" :aspect-ratio="1 / 1" :src="previewImage" preview=".preview" style="max-height:60vh" />
        </v-card-text>
        <v-card-actions class="pa-0 ma-0">
          <v-btn text @click="cancelCrop">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn text @click="cropImage">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-left">
      <label class="text-body-2 font-weight-bold">Name:</label>
      <v-text-field ref="input" v-model="displayName" class="mb-3"
        :label="$vuetify.lang.t('$vuetify.profile.name')" name="name" type="text" hide-details="auto" solo outlined flat
        dense />

      <label class="text-body-2 font-weight-bold">Email:</label>
      <v-text-field ref="input" v-model="user.email" class="mb-3" :label="$vuetify.lang.t('$vuetify.profile.email')"
        name="email" type="text" hide-details="auto" solo outlined flat dense disabled />
    </div>

    <v-btn class="mt-3" width="100%" outlined :disabled="loading" @click="updateProfile">
      Update Profile
    </v-btn>

    <v-btn class="mt-3" width="100%" color="black" :disabled="loading" outlined dark @click="signOut">
      Sign out
    </v-btn>

    <v-btn class="mt-3" width="100%" color="red" :disabled="loading" outlined dark @click="deleteUser">
      Delete account
    </v-btn>

    <div v-if="!loading" class="text-body-2 red--text">
      You'll lose all the data and content in that account
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {

  components: { VueCropper },

  data: () => ({
    user: firebase.auth().currentUser,
    imageFile: null,
    previewImage: null,
    maxSize: 1024,
    showCrop: false,
    newCropper: 0,
    photoData: null,
    displayName: null
  }),

  computed: {
    loading() {
      return this.$store.state.loading
    },
    alert() {
      return this.$store.state.alert
    }
  },

  mounted() {
    if (!this.user.displayName) { this.displayName = this.user.email.split('@')[0] } else { this.displayName = this.user.displayName }
  },

  methods: {

    async updateProfile() {
      if (!this.displayName) {
        this.$store.commit('setAlert', { open: true, code: true, msg: 'Name is mandatory' })
        this.$store.commit('setLoading', false)
        return
      }

      this.$store.commit('setLoading', true)

      // Get a reference to the storage service, which is used to create references in your storage bucket
      var storage = firebase.storage()

      // Create a storage reference from our storage service
      var storageRef = storage.ref('profiles')

      // Create a reference to 'uuid/profile.png'
      var profileAvatarRef = storageRef.child(this.user.uid + '/profile.jpg')

      // Save profile avatar
      if (this.photoData) {
        profileAvatarRef.putString(this.photoData, 'data_url').then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            this.updateProfileInformation(this.displayName, url)
          }).catch((error) => {
            this.$store.commit('setAlert', { open: true, code: error.code, msg: error.errorMessage })
            this.$store.commit('setLoading', false)
          })
        })
      } else {
        this.updateProfileInformation(this.displayName)
      }
    },

    updateProfileInformation(displayName, photoURL) {
      let data = {
        displayName: displayName
      }

      if (photoURL) data.photoURL = photoURL

      this.user.updateProfile(data).then(() => {
        this.user = firebase.auth().currentUser
        this.photoData = null
        this.$store.commit('setAlert', { open: true, code: 'success', msg: 'Updated Successful' })
        this.$store.commit('setLoading', false)
      }).catch((error) => {
        this.$store.commit('setAlert', { open: true, code: error.code, msg: error.errorMessage })
        this.$store.commit('setLoading', false)
      })
    },

    cancelCrop() {
      this.imageFile = null
      this.previewImage = null
      this.showCrop = false
    },

    cropImage() {
      this.photoData = this.$refs.cropper.getCroppedCanvas().toDataURL()
      this.showCrop = false
    },

    signOut() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/auth/signin')
      })
    },

    deleteUser() {
      this.user.delete().then(() => {
        this.$router.push('/auth/signin')
      })
    },

    launchFilePicker() {
      this.imageFile = null
      this.previewImage = null
      let fileUpload = document.getElementById('photoInput')
      if (fileUpload != null) {
        fileUpload.click()
      }
    },

    onFileChange() {
      this.newCropper++
      const { maxSize } = this
      let size = this.imageFile.size / maxSize / maxSize
      if (!this.imageFile.type.match('image.*')) {
        this.$store.commit('setAlert', { open: true, code: true, msg: 'Please choose an image file' })
      } else if (size > 1) {
        this.$store.commit('setAlert', { open: true, code: true, msg: 'Your file is too big! Please select an image under 1MB' })
      } else {
        this.previewImage = URL.createObjectURL(this.imageFile)
        this.showCrop = true
      }
    }
  }
}
</script>
<style>
.cropper-line, .cropper-point
{
  background-color: rgb(232, 78, 54)
}
.cropper-bg
{
  background-image: none;
  background-color: black
}
</style>
