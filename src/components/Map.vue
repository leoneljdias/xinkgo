<template>
  <div id="general_map"></div>
</template>

<script>
import types from '@/types.json'
import maplibregl from 'maplibre-gl';

export default {
  data() {
    return {
      location: null,
      markers: new Map(),
      myMarker: null,
      map: null,
    }
  },
  async mounted() {
    this.initMap();
    this.$store.dispatch('event/GET_ALL');
  },
  computed:
  {
    items() {
      return this.$store.state.event.all;
    },
    user() {
      return this.$store.state.user.data;
    }
  },
  methods:
  {
    initMap() {

      // Init Map
      this.map = new maplibregl.Map({
        container: 'general_map', // container id
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', // style URL
        center: [0, 0], // starting position [lng, lat]
        zoom: 1, // starting zoom
        attributionControl: false
      });

      // Add zoom and rotation controls to the map.
      this.map.addControl(new maplibregl.NavigationControl());

      // Add geolocate control to the map.
      let geolocationControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      });

      this.map.addControl(geolocationControl);

      // Set an event listener that fires
      // when a geolocate event occurs.
      geolocationControl.on('geolocate', (data) => {
        this.location = data.coords;
      });

      //waiting map loaded
      this.map.on('load', () => {
        geolocationControl.trigger();
      })
    },
    addEventMarker(id, event) {

      if (!this.markers.has(id)) {
        // Customize marker
        var userIcon = document.createElement('div');
        userIcon.className = 'event_marker';
        userIcon.innerHTML = '<i class="' + this.getType(event.type).icon + ' mdi v-icon notranslate v-theme--light v-icon--size-default v-icon--start"  aria-hidden="true"></i>'

        // Add marker to the map.
        let marker = new maplibregl.Marker(userIcon)

        //Update marker to a new position
        marker.setLngLat([event.lng, event.lat]);

        /*
        Ensure the marker is added to the map.
        This is safe to call if it's already added.
        */
        marker.addTo(this.map);
        this.markers.set(id, marker);
      }
    },
    getType(value) {
      return types.filter((item) => item.value == value)[0];
    }
  },
  watch: {
    items: {
      handler() {
        this.items.forEach((event) => {
          this.addEventMarker(event.key, event);
        })
      },
      deep: true
    },
    location() {
      if (this.user) {
        if (this.myMarker) {
          this.myMarker._element.style.backgroundImage = 'url(' + this.user.photoURL + ')';
        } else {
          var userIcon = document.createElement('div');
          userIcon.className = 'my_marker';
          userIcon.style.backgroundImage = 'url(' + this.user.photoURL + ')';
          this.myMarker = new maplibregl.Marker(userIcon)
        }
        this.myMarker.setLngLat([this.location.longitude, this.location.latitude]);
        this.myMarker.addTo(this.map);
      }
    },
  },
}

</script>

<style>
html, body
{
  overflow-y: hidden !important;
}

#general_map {
  width: 100%;
  height: 100%;
}

.event_marker {
  background-repeat: no-repeat;
  background-size: cover;
  background: white;
  border: 2px solid white;
  overflow: hidden;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  width: 32px;
  height: 32px;
}

.event_marker i {
  margin-top: 6px;
  margin-left: 5px;
}

.my_marker {
  background-repeat: no-repeat;
  background-size: cover;
  background: white;
  border: 2px solid white;
  overflow: hidden;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  padding: 32px;
  background-size: 64px;
}
</style>
