<template>
  <div class="pa-5">
    <v-card variant="outlined" class="mb-3" :prepend-icon="('mdi-zodiac-' + item.zodiac)" :title="item.zodiac"
      v-for="item in items" :key="item.uid">
      <template v-slot:prepend>
        <v-icon size="x-large"></v-icon>
      </template>

      <v-card-text class="text-body-2 py-2">
        {{item.bio}}
      </v-card-text>

      <v-card-actions>
        <v-list-item class="w-100">
          <template v-slot:prepend>
            <v-avatar color="grey-darken-3"
              :image="item.photoURL"></v-avatar>
          </template>

          <v-list-item-title>{{item.displayName}}</v-list-item-title>
          <v-list-item-subtitle>{{item.distance}}</v-list-item-subtitle>

          <!--template v-slot:append>
            <div class="justify-self-end">
              <v-icon class="mr-1" icon="mdi-heart"></v-icon>
              <span class="subheading mr-2">256</span>
            </div>
          </template-->
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import * as turf from "@turf/turf";

export default {
  data() {
    return {
    }
  },
  computed:
  {
    items() {
      let people = this.$store.state.people.all;
      let user = this.$store.state.user.data;
      let results = [];
      if (people && user) {
        people.forEach(person => {
          person.distance = this.calcDistance(person, user);
          results.push(person)
        });
      }
      return results;
    }
  },
  methods: {
    calcDistance(person, user) {
      var from = turf.point([user.longitude, user.latitude]);
      var to = turf.point([person.longitude, person.latitude]);
      var options = { units: 'kilometers' };
      let meters = turf.distance(from, to, options) * 1000;
      return (meters > 1000) ? (meters/1000).toFixed(2) + " kms" : meters + " m";
    }
  },
  mounted() {
    this.$store.dispatch('people/GET_ALL');
  }
}

</script>

<style>

</style>
