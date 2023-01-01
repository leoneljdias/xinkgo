<template>
  <v-card class="pt-2" :id="'event-' + event.key" dark>
    <template v-slot:prepend>
      <v-list-item class="ma-0 pa-0 ">
        <template v-slot:prepend>
          <v-avatar :image="event.photoURL"></v-avatar>
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
      <span class="text-body-2  py-2 mb-4">{{ item.summary }}</span>
      <div v-bind:id="mapid" class="map mt-2" v-if="displayMap"></div>
    </v-card-text>

    <v-card-actions class="pr-5 pl-4">
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

    <v-divider></v-divider>
    <v-btn :loading="sharing" block prepend-icon="mdi-share-variant"
      @click="share(event.key, event.summary, event.username)" data-html2canvas-ignore>Share</v-btn>
  </v-card>
</template>

<script>
import maplibregl from 'maplibre-gl';
import types from '@/types.json'
import xIconPng from '@/assets/xicon.png'
import html2canvas from 'html2canvas'

export default {
  props: ["item", "user", "canDelete", "canContact", "displayMap"],
  data: () => ({
    sharing: false,
  }),
  async mounted() {

    if (this.displayMap) {
      let map = new maplibregl.Map({
        container: this.mapid,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', // style URL
        center: [this.event.lng, this.event.lat],
        zoom: 14,
        attributionControl: false,
        interactive: false,
        preserveDrawingBuffer: true
      });

      //add marker in map
      var xIcon = document.createElement('div');
      xIcon.className = 'xMarker';
      xIcon.style.backgroundImage = 'url(' + xIconPng + ')';
      new maplibregl.Marker(xIcon).setLngLat([this.event.lng, this.event.lat]).addTo(map);
    }

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
      this.$store.dispatch('event/DELETE', { key, uid, user: this.user })
    },
    async share(key, summary, title, url) {

      this.sharing = true

      if (!('share' in navigator)) {
        console.warn('Sharing not supported', shareData)
        this.sharing = false
        return
      }

      const optionsHtml2canvas = { logging: true, letterRendering: 1, allowTaint: false, useCORS: true }

      const canvas = await html2canvas(document.querySelector("#event-" + key), optionsHtml2canvas)

      canvas.toBlob(async (blob) => {

        const files = [new File([blob], 'image.png', { type: blob.type })]

        const shareData = { url: url, text: summary, title: title, files }

        if (navigator.canShare(shareData)) {
          try {

            await navigator.share(shareData)
            this.sharing = false;

          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error(err.name, err.message)
            }
            this.sharing = false;
          }
        } else {
          this.sharing = false;
          console.warn('Sharing not supported', shareData)
        }
      });
    },
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
