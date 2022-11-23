import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    people: [],
    subscribe: null
  },
  mutations: {
    SET_PEOPLE(state, people) {
      state.all = people
    },
    SET_SUBSCRIBE(state, subscribe) {
      state.subscribe = subscribe
    },
    SET_UNSUBSCRIBE(state) {
      let unsubscribe = state.subscribe;
      unsubscribe();
      state.subscribe = null;
    },
  },
  actions: {
    unsubscribe(context)
    {
      context.commit("SET_UNSUBSCRIBE");
    },

    async subscribeChange(context, payload) {
      const db = getFirestore();
      const q = query(collection(db, "users"), where("active", "==", true));

      const subscribe = onSnapshot(q, (snapshot) => {
        const users = new Map();
        snapshot.docChanges().forEach((change) => {

          let user = change.doc.data();
          let id = change.doc.id;

          if (change.type === "added") {
            if (users.has(id)) {
              let userToUpdate = users.get(id);
              userToUpdate = Object.assign(userToUpdate, user);
              users.set(id, userToUpdate);
              console.log("Updated user: ", id);
            } else {
              users.set(id, user);
              console.log("New user: ", id);
            }
          }

          if (change.type === "modified") {
            if (users.has(id)) {
              let userToUpdate = users.get(id);
              userToUpdate = Object.assign(userToUpdate, user);
              users.set(id, userToUpdate);
              console.log("Modified user: ", id);
            } else {
              users.set(id, user);
              console.log("New user: ", id);
            }
          }
          if (change.type === "removed") {
            if (users.has(id)) {
              users.delete(id);
              console.log("Removed user: ", id);
            }
          }
        });
        context.commit("SET_PEOPLE", users);
      });

      context.commit("SET_SUBSCRIBE", subscribe);
    }
  }
};
