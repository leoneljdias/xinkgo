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

    <v-divider class="mb-3"></v-divider>

    <p class="text-body-2 mb-3"><span style="line-height: 28px">Select your birthday:</span>
      <v-chip :prepend-icon="'mdi-zodiac-' + user.zodiac.toLowerCase()" right
        class="text-body-2 font-weight-medium mb-3" size="small" style="float:right" v-if="user.zodiac">{{
            user.zodiac.toUpperCase()
        }}</v-chip>
    </p>
    <DatePicker v-model="date" :model-config="modelConfig" color="gray" is-expanded class="mb-3" />

    <v-btn class="mb-3" width="100%" max-width="400" prepend-icon="mdi-content-save" variant="outlined"
      @click="updateDataProfile">
      Save
    </v-btn>

    <v-btn width="100%" max-width="400" prepend-icon="mdi-logout" variant="outlined" @click="logOut">
      Logout
    </v-btn>

    <v-snackbar dark v-model="errorDate" color="red">
      Please select your birthday to continue!
    </v-snackbar>

    <v-snackbar dark v-model="errorValidDate" color="red">
      Please select valid date!
    </v-snackbar>


  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import 'v-calendar/dist/style.css'

const store = useStore()
const router = useRouter()
const user = computed(() => store.state.user.data)
const modelConfig = { type: 'string', mask: 'YYYY-MM-DD' };

let date = ref(null)
let errorDate = ref(false)
let errorValidDate = ref(false)

const logOut = async () => {
  await store.dispatch('people/unsubscribe')
  await store.dispatch('user/logOut')
  router.push('/')
}

const updateDataProfile = async () => {
  if (!date.value) {
    errorValidDate.value = true;
  } else {
    errorValidDate.value = false;
    await store.dispatch('user/writeUserData', user.value)
    router.push('/')
  }
}

const getSign = (value) => {
  let index = zodiacs.findIndex(zodiac => {
    let dateMin = new Date(zodiac.dateMin)
    let dateMax = new Date(zodiac.dateMax)
    let date = new Date(value)
    return date.getDate() >= dateMin.getDate() && date.getMonth() == dateMin.getMonth() || date.getDate() <= dateMax.getDate() && date.getMonth() === dateMax.getMonth();
  });

  return zodiacs[index];
}

const zodiacs = [{
  "sign": "aries",
  "dateMin": "2000-03-21",
  "dateMax": "2000-04-20"
}, {
  "sign": "taurus",
  "dateMin": "2000-04-21",
  "dateMax": "2000-05-21"
}, {
  "sign": "gemini",
  "dateMin": "2000-05-22",
  "dateMax": "2000-06-21"
}, {
  "sign": "cancer",
  "dateMin": "2000-06-22",
  "dateMax": "2000-07-22"
}, {
  "sign": "leo",
  "dateMin": "2000-07-23",
  "dateMax": "2000-08-22"
}, {
  "sign": "virgo",
  "dateMin": "2000-08-23",
  "dateMax": "2000-09-23"
}, {
  "sign": "libra",
  "dateMin": "2000-09-24",
  "dateMax": "2000-10-23"
}, {
  "sign": "scorpio",
  "dateMin": "2000-10-24",
  "dateMax": "2000-11-22"
}, {
  "sign": "sagittarius",
  "dateMin": "2000-11-23",
  "dateMax": "2000-12-21"
}, {
  "sign": "capricorn",
  "dateMin": "2000-12-22",
  "dateMax": "2000-01-20"
}, {
  "sign": "aquarius",
  "dateMin": "2000-01-21",
  "dateMax": "2000-02-19"
}, {
  "sign": "pisces",
  "dateMin": "2000-02-20",
  "dateMax": "2000-03-20"
}];

watch(date, async (newState) => {
  let zodiac = getSign(newState);
  if (zodiac) {
    user.value.zodiac = zodiac.sign;
    user.value.birthday = newState;
  } else {
    errorDate.value = true;
  }
})

watch(user, async (newState) => {
  date.value = newState.birthday;
});

</script>

<style>

</style>
