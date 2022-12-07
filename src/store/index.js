import { createStore } from 'vuex'

import user from "./user";
import event from "./event";

export default new createStore({
  modules: {
    user,
    event
  },
});
