<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = ref(null)
const markers = ref(new Map())
const userMarker = ref(null)
const store = useStore()

const user = computed(() => store.state.user.data)

const people = computed(() => store.state.people.all)

onMounted(() => {
  map.value = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1 // starting zoom
  });

  // Add zoom and rotation controls to the map.
  map.value.addControl(new maplibregl.NavigationControl());

  map.value.on('load', () => {

    // Customize user marker
    var userIcon = document.createElement('div');
    userIcon.className = 'marker';
    userIcon.style.backgroundImage = 'url(' + user.value.photoURL + ')';

    // Add user marker to the map.
    userMarker.value = new maplibregl.Marker(userIcon)

    // Locate the user
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        //Update user marker to a new position
        userMarker.value.setLngLat([position.coords.longitude, position.coords.latitude]);

        /*
        Ensure the marker is added to the map.
        This is safe to call if it's already added.
        */
        userMarker.value.addTo(map.value);

        /* Update User Location in Firestore */
        store.dispatch('user/setLocation', { uid: user.value.uid, coords: position.coords })

        // Fly to a random location
        map.value.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 14,
          essential: true
        });

      });
    } else { /* geolocation IS NOT available, handle it */ }
  });
})

watch(people, async (newState) => {
  newState.forEach((person, id) => {
    if (user.uid != id)
      addUserMarker(id, person);
  })
})

// add user marker
function addUserMarker(id, user) {

  if (!markers.value.has(id)) {
    // Customize user marker
    var userIcon = document.createElement('div');
    userIcon.className = 'marker';
    userIcon.style.backgroundImage = 'url(' + user.photoURL + ')';

    // Add user marker to the map.
    let marker = new maplibregl.Marker(userIcon)

    //Update user marker to a new position
    marker.setLngLat([user.lng, user.lat]);

    /*
    Ensure the marker is added to the map.
    This is safe to call if it's already added.
    */
    marker.addTo(map.value);

    markers.value.set(id, marker);
  } else {
    let marker = markers.value.get(id);
    //Update user marker to a new position
    marker.setLngLat([user.lng, user.lat]);
    markers.value.set(id, marker);
  }

}

</script>

<style>
#map {
  width: 100vw;
  height: 100vh;
}

.marker {
  background-repeat: no-repeat;
  background-size: cover;
  border: 2px solid white;
  overflow: hidden;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  width: 48px;
  height: 48px;
}
</style>
