<template>
  <div class="pa-5 text-center mb-15" v-if="user">
    <v-row cols="2">
      <v-col col="3">
        <v-avatar v-ripple tile size="50" class="mb-3" style="float:left">
          <img :src="user.photoURL" alt="avatar" width="50">
        </v-avatar>
      </v-col>
      <v-col col="9">
        <h3 class="text-right">{{ user.displayName }}</h3>
        <p class="text-right text-body-2">{{ user.email }}</p>
      </v-col>
    </v-row>

    <v-divider class="mb-3"></v-divider>

    <h4 class="text-center text-body-2 mb-3" v-if="zodiac"><b>YOUR BIRTHDAY:</b> {{ birthday }} <v-icon size="x-small"
        :icon="icon" class="mr-1"></v-icon>{{ zodiac }}</h4>

    <DatePicker v-model="birthday" :key="datePickerKey" :model-config="modelConfig" color="gray" is-expanded
      class="mb-3" :max-date='new Date()' />

    <p>
      <v-btn class="mb-3" width="100%" max-width="400" prepend-icon="mdi-content-save" variant="outlined"
        @click="update()">
        Save and continue
      </v-btn>
    </p>

  </div>
</template>

<script>


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

import { useStore, } from 'vuex'
import { useRouter } from 'vue-router'


export default {

  setup() {

    const store = useStore()
    const router = useRouter()

    const updateData = async (userData) => {
      await store.dispatch("user/FETCH_DATA", userData);
      router.push('/')
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

    return {
      updateData,
      getSign,
    }
  },
  data() {
    return {
      datePickerKey: 0,
      birthday: new Date(),
      zodiac: null,
      modelConfig: { type: 'string', mask: 'YYYY-MM-DD' },
      rules: [v => v.length <= 120 || 'Max 120 characters'],
    }
  },
  mounted() {
    if (!!this.user) this.fetchDataProfile(this.user.birthday)
  },
  computed:
  {
    user() {
      return this.$store.state.user.data;
    }
  },
  watch: {
    user(data) {
      if (!!data) {
        this.fetchDataProfile(data.birthday)
      }
    },
    birthday(data) {
      if (!!data) this.fetchDataProfile(data)
    }
  },
  methods: {
    fetchDataProfile(birthday) {
      this.birthday = birthday;
      this.datePickerKey++;
      let zodiacSign = this.getSign(birthday);

      if (zodiacSign && zodiacSign.sign) {
        this.zodiac = zodiacSign.sign.toLowerCase()
        this.icon = "mdi-zodiac-" + zodiacSign.sign.toLowerCase()
      }
    },
    update() {
      if (this.user && this.user.uid) {
        let userData = { ...this.user }
        userData.birthday = this.birthday;
        userData.zodiac = this.zodiac;
        this.updateData(userData)
      }
    }
  }
}

</script>

<style>

</style>
