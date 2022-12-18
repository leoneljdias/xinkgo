import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  sendEmailVerification,
  signOut
} from "firebase/auth";

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  serverTimestamp,
} from "firebase/database";

import {
  getStorage,
  ref as refStorage,
  uploadString,
  getDownloadURL
} from "firebase/storage";


export default {
  namespaced: true,
  state: {
    data: null,
    events: []
  },
  mutations: {
    set_data(state, data) {
      state.data = data
    },
    add_event(state, event) {
      state.events.push(event);
    },
    set_events(state, events) {
      state.events = events;
    },
  },
  actions: {
    LOGIN(context, provider) {

      const auth = getAuth();

      let authProvider = null
      switch (provider) {
        case 'facebook':
          authProvider = new FacebookAuthProvider();
          break;
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        default:
          break;
      }

      return new Promise((resolve, reject) => {
        signInWithRedirect(auth, authProvider).then((response) => {
            const user = response.user;
            resolve(user);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async LOGGOUT(context) {
      const auth = getAuth()
      context.commit('set_data', null)
      await signOut(auth)
    },

    REGISTER(_, payload) {
      const auth = getAuth();

      return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, payload.email, payload.password)
          .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user).then((data) => {
              resolve(data);
            }).catch((error) => {
              reject(error);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    SIGNIN(_, payload) {
      const auth = getAuth();

      return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, payload.email, payload.password)
          .then((userCredential) => {
            const user = userCredential.user;
            resolve(user);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    GET_DATA(context, user) {
      return new Promise((resolve) => {
        const db = getDatabase();
        onValue(ref(db, 'users/' + user.uid), (snapshot) => {
          const userData = snapshot.val();
          context.commit("set_data", userData);
          resolve(userData);
        })
      })
    },

    async UPDATE_DATA(context, user) {
      context.dispatch('FETCH_DATA', user)
    },

    UPDATE_PHOTO(context, {uid, data}) {
      return new Promise((resolve) => {
        const storage = getStorage();
        const avatarUserRef = refStorage(storage, `/profiles/` + uid + '/profile.jpg')

        uploadString(avatarUserRef, data, 'data_url').then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL)
          });
        });
      });
    },

    async FETCH_DATA(context, user) {

      const db = getDatabase();

      console.log(user);

      if (user.updatedPhoto) {
        let uid = user.uid;
        let data = user.photoURL;
        user.photoURL = await context.dispatch('UPDATE_PHOTO', {uid: uid, data: data})
      }

      let userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        bio: user.bio || "",
        updatedAt: serverTimestamp(),
        latitude: user.latitude || 0,
        longitude: user.longitude || 0,
        altitude: user.altitude || 0,
        altitudeAccuracy: user.altitudeAccuracy || 0,
        heading: user.heading || 0,
        speed: user.speed || 0,
        accuracy: user.accuracy || 0,
      };

      set(ref(db, 'users/' + user.uid), userData);

      context.commit("set_data", userData);
    },

    async SET_USER(context, user) {
      context.commit("set_data", user);
    },

    async GET_EVENTS(context, useruid) {

      context.commit("set_events", []);
      const db = getDatabase();
      const dbRef = ref(db);

      get(child(dbRef, `/user-events/` + useruid)).then((snapshot_events) => {
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
            }, {
              onlyOnce: true
            })
          });

        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });

    }
  }
};
