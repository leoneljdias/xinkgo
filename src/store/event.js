import {
  getDatabase,
  ref,
  child,
  push,
  update,
  get,
  serverTimestamp,
  onValue,
  remove
} from "firebase/database";

export default {
  namespaced: true,
  state: {
    all: [],
    isLoading: false,
  },
  mutations: {
    add_event(state, event) {
      state.all.push(event);
    },
    set_events(state, events) {
      state.all = events;
    },
    set_loading(state, status) {
      state.isLoading = status;
    },
  },
  actions: {
    async WRITE(context, payload) {
      const dbRef = ref(getDatabase());

      let data = payload.data;
      let user = payload.user;

      let uid = data.uid;

      // A event entry.
      const eventData = {
        author: uid,
        summary: data.summary,
        total: data.total,
        lat: data.lat,
        lng: data.lng,
        datetime: data.datetime,
        type: data.type,
        createdat: serverTimestamp(),
      };

      // Get a key for a new Event.
      const newEventKey = push(child(dbRef, 'events')).key;

      // Write the new event's data simultaneously in the events list and the user's event list.
      const updates = {};
      updates['/events/' + newEventKey] = eventData;
      updates['/user-events/' + uid + '/' + newEventKey] = eventData;

      await update(dbRef, updates);
      return await context.dispatch('GET_ALL', user);
    },
    async GET_ALL(context, user) {

      const db = getDatabase();
      const dbRef = ref(db);
      context.commit("set_loading", true);
      context.commit("set_events", []);

      console.log(user);
      get(child(dbRef, `events`).orderByChild("datetime").limitToFirst(1)).then((snapshot_events) => {

        if (snapshot_events.exists()) {
          snapshot_events.forEach((child) => {
            let event = child.val();
            event.key = child.key
            onValue(ref(db, '/users/' + event.author), (snapshot_user) => {
              const username = (snapshot_user.val() && snapshot_user.val().displayName) || 'Anonymous';
              const photoURL = (snapshot_user.val() && snapshot_user.val().photoURL);
              event["username"] = username;
              event["photoURL"] = photoURL;
              context.commit("add_event", event);
              context.commit("set_loading", false);
            }, {
              onlyOnce: true
            })
          });

        } else {
          context.commit("set_loading", false);
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });

    },
    async DELETE(context, payload) {
      const db = getDatabase();
      await remove(ref(db, '/events/' + payload.key));
      await remove(ref(db, '/user-events/' + payload.uid + '/' + payload.key));
      return await context.dispatch('GET_ALL', payload.user);
    },
    async WRITE_MSG(context, data) {
      const dbRef = ref(getDatabase());

      let uid = data.uid;

      // A message entry.
      const msgData = {
        eventKey: eventKey,
        author: uid,
        useruid: userid,
        message: data.message,
        createdat: serverTimestamp(),
      };

      // Get a key for a new Chat.
      const newChatKey = push(child(dbRef, 'chats')).key;

      // Write the new event's data simultaneously in the events list and the user's event list.
      const updates = {};
      updates['/chats/' + newChatKey] = msgData;
      updates['/event-chats/' + eventKey + '/' + newChatKey] = msgData;

      await update(dbRef, updates);
    },
  }
};
