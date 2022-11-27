import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  doc,
  collection,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    data: null,
    acceptCookies: false,
    location: null
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.loggedIn = value
    },
    SET_USER(state, data) {
      state.data = data
    },
    SET_ACCEPT_COOKIES(state, value) {
      state.acceptCookies = value
    },
    SET_LOCATION(state, location) {
      state.location = location
    },
  },
  actions: {
    async facebook({
      dispatch,
      commit
    }) {
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      const response = await signInWithPopup(auth, provider)
      if (response) {
        const user = response.user
        await dispatch('writeUserDataWithPhoto', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        });
      } else {
        throw new Error('login failed')
      }
    },

    async google({
      dispatch,
      commit
    }) {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider)
      if (response) {
        const user = response.user
        await dispatch('writeUserDataWithPhoto', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        });

      } else {
        throw new Error('login failed')
      }
    },

    async twitter({
      dispatch,
      commit
    }) {
      const auth = getAuth();
      const provider = new TwitterAuthProvider();
      const response = await signInWithPopup(auth, provider)
      if (response) {
        const user = response.user
        await dispatch('writeUserDataWithPhoto', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        });

      } else {
        throw new Error('login failed')
      }
    },

    async writeUserData({
      dispatch,
      commit
    }, user) {

      let userid = user.uid;
      const db = getFirestore();
      const userRef = collection(db, "users");

      // Create a root reference
      const storage = getStorage();

      // Create a storage reference from our storage service
      var storageRef = ref(storage, 'profiles/' + userid + '/profile.jpg')

      setDoc(doc(userRef, userid), user, {
        merge: true
      })
      commit("SET_USER", user);

    },

    async writeUserDataWithPhoto({
      dispatch,
      commit
    }, user) {

      let userid = user.uid;
      const db = getFirestore();
      const userRef = collection(db, "users");

      // Create a root reference
      const storage = getStorage();

      // Create a storage reference from our storage service
      var storageRef = ref(storage, 'profiles/' + userid + '/profile.jpg')

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        var blob = xhr.response;
        // Save profile avatar
        uploadBytes(storageRef, blob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            user.photoURL = url;
            setDoc(doc(userRef, userid), user, {
              merge: true
            })
            commit("SET_USER", user);
          })
        })
      };
      xhr.open('GET', user.photoURL);
      xhr.send();

    },

    async logOut({
      dispatch,
      commit
    }) {
      const auth = getAuth()
      await signOut(auth)
      commit('SET_USER', null)
      commit("SET_LOCATION", null)
    },

    setAcceptCookies({
      dispatch,
      commit
    }, value) {
      commit('SET_ACCEPT_COOKIES', value)
    },

    fetchUser({
      dispatch,
      commit
    }, user) {
      commit("SET_USER", user)
    },

    async setLocation({
      dispatch,
      commit
    }, payload) {

      let userid = payload.uid;
      const db = getFirestore();
      const userRef = collection(db, "users");

      let dataLocation = {
        lat: payload.coords.latitude,
        lng: payload.coords.longitude,
        active: true,
        timestamp: serverTimestamp()
      };

      await setDoc(doc(userRef, userid), dataLocation, {
        merge: true
      });

      commit("SET_LOCATION", location)
    },
  }
};
