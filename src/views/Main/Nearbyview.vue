<template>
  <v-container class="viewpage">
    <div
      id="mapContainer"
      class="basemap"
    />
  </v-container>
</template>

<script>

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibGVvbmVsamRpYXMiLCJhIjoiY2w5eDF0YXhjMDZwMjN2cXJnOGZiM3h2aiJ9.kmpJ2xXYqfLB71v7LLIsRA'

export default {
  name: 'BaseMap',
  data () {
    return {
      accessToken: MAPBOX_ACCESS_TOKEN,
      map: null
    }
  },
  beforeDestroy () {
    if (this.map) this.map.remove()
  },
  mounted () {
    setTimeout(() => {
      mapboxgl.accessToken = this.accessToken

      this.map = new mapboxgl.Map({
        container: 'mapContainer',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [103.811279, 1.345399],
        zoom: 12
      })

      // Add the navigation control to the map
      const nav = new mapboxgl.NavigationControl()
      this.map.addControl(nav, 'top-right')

      // Initialize the geolocate control.
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })

      // Add the control to the map.
      this.map.addControl(geolocate)
      this.map.on('load', function () {
        geolocate.trigger() // <- Automatically activates geolocation
      })
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
.basemap {
    width: 100%;
    height: 100%;
}

.viewpage {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 0px;
}
</style>
