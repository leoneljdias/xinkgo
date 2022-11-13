<template>
  <v-bottom-navigation
    v-model="value"
    grow
    fixed
    color="#e84e36"
  >
    <v-btn :to="{ name: 'nearby' }">
      <span>Map</span>
      <v-icon>mdi-earth</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'favorites' }">
      <span>Favorites</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'recents' }">
      <span>Recents</span>
      <v-icon>mdi-camera-timer</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'profile' }">
      <span>Profile</span>
      <v-icon>mdi-face-man</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>

export default {
  name: 'TopToolbar',
  components: {
  },
  data () {
    return { value: 0 }
  }
}
</script>
<style>
   .v-item-group.v-bottom-navigation .v-btn.v-size--default {
        height: inherit;
    }
</style>
