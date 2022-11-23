import { createStore } from 'vuex'

import user from "./user";
import people from "./people";

export default new createStore({
  modules: {
    user,
    people
  },
});
