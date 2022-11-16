export default {
  state: {
    loading: false,
    alert: {
      open: false,
      msg: null
    }
  },

  mutations: {
    setLoading (state, loading) {
      state.loading = loading
    },

    setAlert (state, alert) {
      state.alert = alert
    }
  }
}
