<template>
  <v-dialog v-model="isOpen" fullscreen persistent transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>Profile</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-3 text-center">
        <v-form v-model="form" @submit.prevent="onSubmit">
          <v-avatar size="96" class="mb-5" @click="openCropper">
            <v-img :src="user.photoURL ?? photoUrl" />
          </v-avatar>

          <v-text-field label="Display Name" density="compact" :rules="[required]" variant="outlined" class="mb-5"
            maxlength="30" v-model="user.displayName" hide-details></v-text-field>

          <v-text-field label="Email" readonly density="compact" variant="outlined" class="mb-5" v-model="user.email"
            hide-details></v-text-field>

          <v-textarea label="Bio" density="compact" variant="outlined" v-model="user.bio" maxlength="255" hide-details
            class="mb-5" rows="7"></v-textarea>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="onCancel">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="onSubmit" type="submit">
          Save
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <avatar-cropper ref="cropper" v-model="showCropper" @submit="handleSubmitPhoto" />
</template>

<script>
import AvatarCropper from 'vue-avatar-cropper'
import photoUrl from '@/assets/user.png'

export default {
  props: ['modelValue'],
  components: { AvatarCropper },
  data() {
    return {
      form: false,
      photoUrl: photoUrl,
      showDialog: false,
      showCropper: false,
    };
  },
  computed: {
    isOpen: {
      // getter
      get() {
        return this.modelValue;
      },
      // setter
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      }
    },
    user() {
      return this.$store.state.user.data;
    }
  },
  methods: {
    onCancel() {
      this.isOpen = false;
      this.user.updatedPhoto = false;
    },
    onSubmit() {
      if (!this.user.displayName) return
      this.$store.dispatch('user/UPDATE_DATA', this.user);
      this.user.updatedPhoto = false;
      this.isOpen = false;
    },
    handleSubmitPhoto() {
      this.user.photoURL = this.$refs.cropper.cropper.getCroppedCanvas().toDataURL();
      this.user.updatedPhoto = true;
    },
    openCropper() {
      this.user.updatedPhoto = false;
      this.showCropper = true;
    },
    required(v) {
      return !!v || 'Field is required'
    },
  },
}
</script>

<style>
.avatar-cropper-close {
  display: none;
}

.avatar-cropper .avatar-cropper-mark {
  background-color: black;
}
</style>
