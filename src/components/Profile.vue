<template>
  <div class="pa-5" v-if="user">
    <v-row cols="2">
      <v-col col="3">
        <v-avatar v-ripple tile size="50" class="mb-3">
          <img :src="user.photoURL" alt="avatar" width="50">
        </v-avatar>
      </v-col>
      <v-col col="9">
        <h3 class="text-right">{{ user.displayName }}</h3>
        <p class="text-right text-body-2">{{ user.email }}</p>
      </v-col>
    </v-row>

    <v-divider class="mb-3 mt-1"></v-divider>

    <p class="text-body-2 mb-3"><span style="line-height: 28px">Select your birthday:</span><v-chip :prepend-icon="signIcon" right :color="signColor" class="text-body-2 font-weight-medium mb-3" size="small" style="float:right">{{ signDetail.sign }} & {{ signDetail.element }}</v-chip></p>
    <DatePicker v-model="date" :model-config="modelConfig" color="gray" is-expanded class="mb-3"/>

    <v-btn class="mb-3" width="100%" max-width="400" prepend-icon="mdi-content-save" variant="outlined"
      @click="updateProfile">
      Save
    </v-btn>

    <v-btn width="100%" max-width="400" prepend-icon="mdi-logout" variant="outlined" @click="logOut">
      Logout
    </v-btn>

  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import signTeller from 'sign-teller'
import 'v-calendar/dist/style.css'

const modelConfig = { type: 'string', mask: 'YYYY-MM-DD' };

const store = useStore()
const router = useRouter()
const user = computed(() => store.state.user.data)
let signDetail = ref(null)
let signIcon = ref(null)
let signColor = ref(null)

const logOut = async () => {
  await store.dispatch('people/unsubscribe')
  await store.dispatch('user/logOut')
  router.push('/')
}

const getSignColor = (element) => {
  //red with fire, yellow with earth, green with water, and blue with air
  switch(element.toLowerCase())
  {
    case 'fire':
      return 'red';
    case 'earth':
      return 'yellow';
    case 'water':
      return 'green';
    case 'air':
      return 'green';
    default:
      return 'white';
  }
}

const getSignIcon = (sign) => {
  //red with fire, yellow with earth, green with water, and blue with air
  return "mdi-zodiac-" + sign.toLowerCase();
}

onMounted(() => {
  const date = '1987-03-23'
  signDetail = signTeller({ day: 4, month: 7 });

  signIcon = getSignIcon(signDetail.sign);
  signColor = getSignColor(signDetail.element);
});



</script>

<style>

</style>
