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
        await dispatch('writeUserData', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        })
        commit("SET_USER", {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        })
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
        await dispatch('writeUserData', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        })
        commit("SET_USER", {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        })
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
        await dispatch('writeUserData', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        })
        commit("SET_USER", {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        })
      } else {
        throw new Error('login failed')
      }
    },

    async writeUserData(_, user) {

      let userid = user.uid;
      const db = getFirestore();
      const userRef = collection(db, "users");

      setDoc(doc(userRef, userid), user, {
        merge: true
      }).catch(error => {
        console.log(error.message)
      });
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
      commit("SET_USER", {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      })
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
