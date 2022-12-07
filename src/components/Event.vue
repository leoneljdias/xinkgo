<template>
  <v-card variant="outlined" color="grey" class="pt-2">
    <template v-slot:prepend>
      <v-list-item class="ma-0 pa-0 text-black">
        <template v-slot:prepend>
          <v-avatar color="grey-darken-3" :image="event.photoURL"></v-avatar>
        </template>

        <v-list-item-title class="font-weight-bold">{{ event.username }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption font-weight-medium">{{ new
            Date(event.createdat).toISOString().slice(0, 16).replace('T', ' ')
        }}</v-list-item-subtitle>
      </v-list-item>
    </template>

    <template v-slot:append>
      <div class="justify-self-end" v-if="((event.author == user.uid) && canDelete)">
        <v-icon class="mr-1" icon="mdi-delete" @click="deleteEvent(event.key, user.uid)"></v-icon>
      </div>
    </template>

    <v-card-text class="pb-0">
      <span class="text-body-2 text-black py-2 mb-4">{{ item.summary }}</span>
      <div v-bind:id="mapid" class="map mt-2"></div>
    </v-card-text>

    <v-card-actions class="pr-5 pl-5">
      <v-icon class="mr-1">{{ this.getType(event.type).icon }}</v-icon>
      <v-list-item-title class="font-weight-bold">{{ this.getType(event.type).title }}</v-list-item-title>
      <v-spacer></v-spacer>
      <v-list-item two-line class="pa-0 ma-0">
        <v-list-item-title class="text-caption font-weight-medium text-end">{{ new
            Date(event.datetime).toISOString().slice(0, 16).replace('T', ' ')
        }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption font-weight-bold text-end">People: {{ event.total || 1
        }}</v-list-item-subtitle>
      </v-list-item>

    </v-card-actions>
  </v-card>
</template>

<script>
import maplibregl from 'maplibre-gl';
import types from '@/types.json'
import xIconPng from '@/assets/xicon.png'

export default {
  props: ["item", "user", "canDelete", "canContact"],
  async mounted() {
    let map = new maplibregl.Map({
      container: this.mapid,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [this.event.lng, this.event.lat],
      zoom: 14,
      attributionControl: false,
      interactive: false
    });

    //add marker in map
    var xIcon = document.createElement('div');
    xIcon.className = 'xMarker';
    xIcon.style.backgroundImage = 'url(' + xIconPng + ')';
    new maplibregl.Marker(xIcon).setLngLat([this.event.lng, this.event.lat]).addTo(map);
  },
  computed:
  {
    event() {
      return this.item;
    },
    mapid() {
      return this.item.key;
    }
  },
  methods:
  {
    getType(value) {
      return types.filter((item) => item.value == value)[0];
    },
    deleteEvent(key, uid) {
      this.$store.dispatch('event/DELETE', { key, uid })
    }
  }
}
</script>

<style scoped>
.map {
  height: 200px;
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
