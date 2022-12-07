<template>
  <div id="map"></div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

import maplibregl from 'maplibre-gl';

const map = ref(null)
const markers = ref(new Map())
const myMarker = ref(null)

export default {
  setup() {
    const store = useStore()
    const location = ref(null)
    const user = computed(() => store.state.user.data);
    const people = computed(() => store.state.people.all)

    const getAllPeople = () => { store.dispatch('people/GET_ALL') }

    const saveUserPosition = () => {
      if (user.value && user.value.uid && location.value) {
        let userData = { ...user.value }
        userData.latitude = location.value.latitude
        userData.longitude = location.value.longitude
        userData.altitude = location.value.altitude
        userData.altitudeAccuracy = location.value.altitudeAccuracy
        userData.heading = location.value.heading
        userData.speed = location.value.speed
        userData.accuracy = location.value.accuracy
        store.dispatch("user/FETCH_DATA", userData);
      }
    }

    return {
      user,
      people,
      getAllPeople,
      saveUserPosition,
      location,
    }
  },
  async mounted() {
    this.initMap();

    this.saveUserPosition();
    this.getAllPeople();

    setInterval(() => {
      this.saveUserPosition();
      this.getAllPeople();
    }, 30000);
  },

  methods:
  {
    initMap() {

      // Init Map
      map.value = new maplibregl.Map({
        container: 'map', // container id
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', // style URL
        center: [0, 0], // starting position [lng, lat]
        zoom: 1, // starting zoom
        attributionControl: false
      });

      // Add zoom and rotation controls to the map.
      map.value.addControl(new maplibregl.NavigationControl());

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

      map.value.addControl(geolocationControl);

      // Set an event listener that fires
      // when a geolocate event occurs.
      geolocationControl.on('geolocate', (data) => {
        this.location = data.coords;
      });

      //waiting map loaded
      map.value.on('load', () => {
        geolocationControl.trigger();
      })
    },
    addUserMarker(id, person) {

      if (!person.latitude || !person.longitude) return;

      if (!markers.value.has(id)) {
        // Customize user marker
        var userIcon = document.createElement('div');
        userIcon.className = 'person_marker';
        userIcon.innerHTML = '<i class="mdi-zodiac-' + person.zodiac + ' mdi v-icon notranslate v-theme--light v-icon--size-default v-icon--start"  aria-hidden="true"></i>'
        //userIcon.style.backgroundImage = 'url(' + user.photoURL + ')';

        // Add user marker to the map.
        let marker = new maplibregl.Marker(userIcon)

        //Update user marker to a new position
        marker.setLngLat([person.longitude, person.latitude]);

        /*
        Ensure the marker is added to the map.
        This is safe to call if it's already added.
        */
        marker.addTo(map.value);

        markers.value.set(id, marker);
      } else {
        let marker = markers.value.get(id);
        //Update user marker to a new position
        marker.setLngLat([person.longitude, person.latitude]);
        markers.value.set(id, marker);
      }

    },
  },
  watch: {
    people() {
      this.people.forEach((person) => {
        this.addUserMarker(person.id, person);
      })
    },

    location() {

      if (this.user) {
        if (myMarker.value) {
          myMarker.value._element.style.backgroundImage = 'url(' + this.user.photoURL + ')';
        } else {
          var userIcon = document.createElement('div');
          userIcon.className = 'my_marker';
          userIcon.style.backgroundImage = 'url(' + this.user.photoURL + ')';
          myMarker.value = new maplibregl.Marker(userIcon)
        }
        myMarker.value.setLngLat([this.location.longitude, this.location.latitude]);
        myMarker.value.addTo(map.value);
      }
    },
  },
}

</script>

<style>
#map {
  width: 100%;
  height: 100%;
}

.person_marker {
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

.person_marker i {
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
