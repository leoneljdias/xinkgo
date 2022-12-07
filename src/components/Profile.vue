<template>
  <div v-if="items.length > 0">
    <Event v-for="item in items" :item="item" :user="user" :canDelete="true" :key="item.key" class="ma-2" />
  </div>
  <v-container v-else-if="!isLoading" class="fill-height pa-10" fluid>
    <v-responsive class="d-flex align-center text-center fill-height">
      <h1>No events yet?</h1>
      <h4>Please add some event</h4>
    </v-responsive>
  </v-container>
</template>

<script>

import Event from '@/components/Event';

export default {
  components:
  {
    Event
  },
  mounted() {
    this.$store.dispatch('user/GET_EVENTS', this.user.uid);
  },
  data() {
    return {
    }
  },
  computed:
  {
    items() {
      return this.$store.state.user.events;
    },
    user() {
      return this.$store.state.user.data;
    },
    events() {
      return this.$store.state.event.all;
    },
    isLoading() {
      return this.$store.state.event.isLoading;
    },
  },
  watch:
  {
    events: {
      handler(newValue, oldValue) {
        if (newValue != oldValue)
          this.$store.dispatch('user/GET_EVENTS', this.user.uid);
      },
      deep: true
    }
  }
}

</script>
<style>
html, body
{
  overflow-y: auto !important;
}
</style>
