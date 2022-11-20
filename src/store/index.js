import { createStore } from 'vuex'

import user from "./user";

export default new createStore({
  modules: {
    user
  },
});
