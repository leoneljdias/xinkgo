<template>
    <v-container class="fill-height justify-center pa-0" fluid>
      <router-view />
      <BottomNav />
    </v-container>
</template>

<script>
import BottomNav from '@/components/Main/BottomNav'
export default {
  name: 'MainApp',
  components: {
    BottomNav
  },
  data: () => ({
  }),

  mounted () {
  }
}
</script>
