
<template>
  <div class="checkemail">
    <div class="text-center mb-10">
      <v-layout justify-center align-center>
        <span class="text-h6 text--secondary">
          <v-img src="@/assets/img/logo.png" width="210" />
        </span>
      </v-layout>
    </div>
    <div>
      <span class="text--secondary">{{ $vuetify.lang.t('$vuetify.auth.checkemail.message', [email]) }}</span>
    </div>
    <v-btn class="text-none letter-spacing-0 mt-4" color="primary" text
        @click="$router.push({ name: 'signin' })">
        {{ $vuetify.lang.t('$vuetify.auth.checkemail.signin') }}
    </v-btn>
  </div>
</template>

<script>

export default {
  data: () => ({
    email: ''
  }),
  mounted () {
    this.email = this.$route.query.email ?? ''
  }
}
</script>
