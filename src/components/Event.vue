<template>
  <v-card variant="outlined" color="grey">
    <template v-slot:prepend>
      <v-list-item class="ma-0 pa-0 text-black">
        <template v-slot:prepend>
          <v-avatar color="grey-darken-3" :image="user.photoURL"></v-avatar>
        </template>

        <v-list-item-title class="font-weight-bold">{{ user.displayName }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption font-weight-medium">12/02/2020 16h24</v-list-item-subtitle>
      </v-list-item>
    </template>

    <template v-slot:append>
      <div class="justify-self-end">
        <v-icon class="mr-1" icon="mdi-dots-horizontal"></v-icon>
      </div>
    </template>

    <v-card-text>
      <span class="text-body-2 text-black py-2 mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus
      mus. Donec qu</span>
      <div v-bind:id="mapid" class="map mt-2"></div>
    </v-card-text>

    <!--v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:append>
            <div class="justify-self-end">
              <v-icon class="mr-1" icon="mdi-heart"></v-icon>
              <span class="subheading mr-2">256</span>
            </div>
          </template>
      </v-list-item>
    </v-card-actions-->
  </v-card>
</template>

<script>
import maplibregl from 'maplibre-gl';

export default {
  props: ["item"],
  mounted() {
    new maplibregl.Map({
      container: 'map-' + this.item.uid,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [0, 0],
      zoom: 1,
      attributionControl: false,
      interactive: false
    });
  },
  computed:
  {
    user() {
      return this.item;
    },
    mapid() {
      return 'map-' + this.item.uid;
    }
  }
}
</script>

<style scoped>
.map {
  height: 200px;
}
.v-navigation-drawer {
  will-change: initial;
}
</style>

/*
import * as turf from "@turf/turf";
calcDistance(person, user) {
  var from = turf.point([user.longitude, user.latitude]);
  var to = turf.point([person.longitude, person.latitude]);
  var options = { units: 'kilometers' };
  let meters = turf.distance(from, to, options) * 1000;
  return (meters > 1000) ? (meters / 1000).toFixed(2) + " kms" : meters + " m";
}*/
