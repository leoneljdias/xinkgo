<template>
  <v-dialog v-model="isOpen" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>New Event</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-3 pb-0 pt-6">

        <v-select v-model="type" :items="hobbies" density="compact" variant="outlined" label="What?"
          return-object hide-details class="mb-5">
          <template v-slot:selection="{ item }">
            <v-icon class="mr-3">{{ item.value.icon }}</v-icon>{{ item.title }}
          </template>
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :value="item.value" :prepend-icon="item.value.icon"
              :title="item.title"></v-list-item>
          </template>
        </v-select>

        <DatePicker v-model="datetime" mode="dateTime" is24hr>
          <template v-slot="{ _, inputEvents }">
            <v-text-field density="compact" variant="outlined" label="When?" v-model="datetimeFormat" v-on="inputEvents"
              hide-details class="mb-5" />
          </template>
        </DatePicker>

        <v-textarea label="Summary" variant="outlined" v-model="summary"
          :rules="[rules.required, rules.maxLength]" maxlength="120" hide-details class="mb-5"></v-textarea>

        <div id="place" class="map" ref="place"></div>

      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="onCancel">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="onSubmit">
          Post
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import maplibregl from 'maplibre-gl';
import xIconPng from '@/assets/xicon.png'

export default {
  props: ['modelValue'],
  setup() {
    return { xIconPng }
  },
  data() {
    return {
      mapid: 'map',
      showDialog: false,
      items: [
        { title: 'Sports', value: 'sports', icon: 'mdi-run' },
        { title: 'Coffee', value: 'coffee', icon: 'mdi-coffee' },
        { title: 'Gym', value: 'gym', icon: 'mdi-weight-lifter' },
        { title: 'Dance', value: 'dance', icon: 'mdi-human-female-dance' },
        { title: 'Cinema', value: 'cinema', icon: 'mdi-movie' },
        { title: 'Travel', value: 'travel', icon: 'mdi-airplane' },
        { title: 'Music', value: 'music', icon: 'mdi-music' },
        { title: 'Dating', value: 'dating', icon: 'mdi-account-heart' },
        { title: 'Gaming', value: 'gaming', icon: 'mdi-gamepad-variant' },
        { title: 'Shopping', value: 'shopping', icon: 'mdi-shopping' },
        { title: 'Eating', value: 'cooking', icon: 'mdi-food' },
        { title: 'Other', value: 'other', icon: 'mdi-candy' },
      ],
      datetime: new Date(),
      summary: "",
      lat: 0,
      lng: 0,
      type: { title: 'Sports', value: 'sports', icon: 'mdi-run' },
      rules: {
        required: (value) => !!value || "Campo obrigatório",
        maxLength: (value) => (value && value.length <= 120) || `O tamanho máximo é de 120 caracteres`
      },
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
    hobbies() {
      return this.items.sort((a, b) => a.title < b.title ? -1 : 1);
    },
    datetimeFormat() {
      return this.datetime?.toISOString().slice(0, 16).replace('T', ' ');
    },
    user() {
      return this.$store.state.user.data;
    }
  },
  methods: {
    reset()
    {
      this.datetime = new Date();
      this.summary = "";
      this.lat = 0
      this.lng = 0;
      this.type = { title: 'Sports', value: 'sports', icon: 'mdi-run' };
    },
    onCancel() {
      this.reset();
      this.isOpen = false;
    },
    onSubmit() {
      let userid = this.user.uid;
      let eventData = {
        uid: userid,
        lat: this.lat,
        lng: this.lng,
        type: this.type.value,
        summary: this.summary,
        timestamp: this.datetime
      }
      this.$store.dispatch('user/WRITE_NEW_EVENT', eventData);
      this.reset();
      this.isOpen = false;
    },
    async getPlaceName({ lat, lng }) {
      let request = 'Https://nominatim.openstreetmap.org/reverse.php?lat=' + lat + '&lon=' + lng + '&zoom=18&format=jsonv2';
      const response = await fetch(request);
      return await response.json();
    },
  },
  async mounted() {

    await this.$nextTick();

    setTimeout(() => {

      const map = new maplibregl.Map({
        container: 'place',
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl());

      let geolocationControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
      });

      map.addControl(geolocationControl);

      var xIcon = document.createElement('div');
      xIcon.className = 'xMarker';
      xIcon.style.backgroundImage = 'url(' + xIconPng + ')';

      const marker = new maplibregl.Marker(xIcon)

      map.on('move', () => {
        let coords = map.getCenter();
        marker.setLngLat(coords).addTo(map);
        this.lat = coords.lat;
        this.lng = coords.lng;
      });

      map.on('load', () => {
        geolocationControl.trigger();
        let coords = map.getCenter();
        marker.setLngLat(coords).addTo(map);
        this.lat = coords.lat;
        this.lng = coords.lng;
      })
    }, 100);
  },
}
</script>

<style>
.map {
  height: 200px;
  border-radius: 3px;
  border: 1px solid rgb(118, 118, 118, 0.8);
}

.xMarker {
  background-repeat: no-repeat;
  background-size: contain;
  background: transparent;
  overflow: hidden;
  width: 32px;
  height: 32px;
}
</style>
