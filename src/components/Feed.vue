<template>
  <Event v-for="item in items" :item="item" :key="item.uid" class="ma-2"/>
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
  computed:
  {
    items() {
      return this.$store.state.people.all;
    }
  },
  mounted() {
    this.$store.dispatch('people/GET_ALL');
  }
}

</script>
