<template>
  <v-dialog v-model="isOpen" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>New Event</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-3 pb-0 pt-6">

        <v-row cols="12">
          <v-col cols="7">
            <v-select v-model="type" :items="hobbies" density="compact" variant="outlined" label="What?" return-object
              hide-details class="mb-5">
              <template v-slot:selection="{ item }">
                <v-icon class="mr-3">{{ item.value.icon }}</v-icon>{{ item.title }}
              </template>
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :value="item.value" :prepend-icon="item.value.icon"
                  :title="item.title"></v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col cols="5">
            <v-text-field v-model="total" label="People" readonly @click:append-inner="increment"
              append-inner-icon="mdi-plus" @click:prepend-inner="decrement" prepend-inner-icon="mdi-minus"
              density="compact" variant="outlined" type="number" onkeydown="return event.keyCode !== 69" />
          </v-col>
        </v-row>

        <DatePicker v-model="datetime" mode="dateTime" is24hr :input-debounce="500">
          <template v-slot="{ inputEvents }">
            <v-text-field density="compact" variant="outlined" label="When?" v-model="datetimeFormat" v-on="inputEvents"
              hide-details class="mb-5" readonly />
          </template>
        </DatePicker>

        <v-textarea label="Summary" variant="outlined" v-model="summary" :rules="[rules.required, rules.maxLength]"
          maxlength="120" hide-details class="mb-5"></v-textarea>

        <div id="place" class="map" ref="place"></div>

      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="onCancel">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="onSubmit" v-if="!!summary">
          Post
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import maplibregl from 'maplibre-gl';
import xIconPng from '@/assets/xicon.png'
import types from '@/types.json'

export default {
  props: ['modelValue'],
  setup() {
    return { xIconPng }
  },
  data() {
    return {
      mapid: 'map',
      map: null,
      marker: null,
      showDialog: false,
      items: types,
      datetime: new Date(),
      summary: "",
      total: 1,
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
    reset() {
      this.datetime = new Date();
      this.summary = "";
      this.lat = 0
      this.lng = 0;
      this.total = 1;
      this.type = { title: 'Sports', value: 'sports', icon: 'mdi-run' };
    },
    increment() {
      console.log('aqui')
      if (this.total < 8)
        this.total++;
    },
    decrement() {
      if (this.total > 1)
        this.total--;
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
        total: this.total,
        type: this.type.value,
        summary: this.summary,
        datetime: this.datetime
      }

      this.$store.dispatch('event/WRITE', {data: eventData, user: this.user});

      this.reset();
      this.isOpen = false;
    },
    async getPlaceName({ lat, lng }) {
      let request = 'Https://nominatim.openstreetmap.org/reverse.php?lat=' + lat + '&lon=' + lng + '&zoom=18&format=jsonv2';
      const response = await fetch(request);
      return await response.json();
    },
    updatePosition(coords) {
      this.marker.setLngLat(coords).addTo(this.map);
      this.lat = coords.lat;
      this.lng = coords.lng;
    }
  },
  async mounted() {

    await this.$nextTick();

    setTimeout(() => {

      this.map = new maplibregl.Map({
        container: 'place',
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });

      this.map.addControl(new maplibregl.NavigationControl());

      let geolocationControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        showUserLocation: false
      });

      this.map.addControl(geolocationControl);

      var xIcon = document.createElement('div');
      xIcon.className = 'xMarker';
      xIcon.style.backgroundImage = 'url(' + xIconPng + ')';

      this.marker = new maplibregl.Marker(xIcon)

      this.map.on('move', () => {
        let coords = this.map.getCenter();
        this.updatePosition(coords);
      });

      this.map.on('load', () => {
        geolocationControl.trigger();
        let coords = this.map.getCenter();
        this.updatePosition(coords);
      })
    }, 100);
  },
}
</script>

<style scoped>
.map {
  height: 200px;
  border-radius: 3px;
  border: 1px solid rgb(118, 118, 118, 0.8);
}
</style>
