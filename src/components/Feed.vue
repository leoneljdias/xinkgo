<template>
  <div  v-if="items.length > 0">
    <Event v-for="item in items" :item="item" :user="user" :canDelete="false" :canContact="true"  :key="item.key" class="ma-2"/>
  </div>
  <v-container v-else-if="!isLoading" class="fill-height pa-10" fluid>
      <v-responsive class="d-flex align-center text-center fill-height">
        <h1>Empty feed</h1>
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
  data() {
    return {
    }
  },
  mounted()
  {
    this.$store.dispatch('event/GET_ALL');
  },
  computed:
  {
    items() {
      return this.$store.state.event.all;
    },
    isLoading() {
      return this.$store.state.event.isLoading;
    },
    user() {
      return this.$store.state.user.data;
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
