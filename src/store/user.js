import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  doc,
  collection,
  setDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";

import {
  getDatabase,
  ref,
  child,
  push,
  update
} from "firebase/database";

export default {
  namespaced: true,
  state: {
    data: null,
    loggedIn: false
  },
  mutations: {
    set_data(state, data) {
      state.data = data
    },
    set_loggedIn(state, loggedIn) {
      state.loggedIn = loggedIn
    },
  },
  actions: {
    async LOGIN(context, provider) {

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

      if (authProvider) {
        const response = await signInWithPopup(auth, authProvider)

        if (!response && !response.user) {
          throw new Error('Login failed')
        }

        context.dispatch('UPDATE_DATA', response.user)
        context.commit('set_loggedIn', response.user !== null)
      }
    },

    async LOGGOUT(context) {
      const auth = getAuth()
      context.commit('set_data', null)
      context.commit('set_loggedIn', false)
      await signOut(auth)
    },

    async UPDATE_DATA(context, user) {
      const db = getFirestore();
      const userRef = collection(db, "users");
      const userDocRef = doc(userRef, user.uid);

      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists())
        context.dispatch('FETCH_DATA', userDoc.data())
      else
        context.dispatch('FETCH_DATA', user)
    },

    async FETCH_DATA(context, user) {

      const db = getFirestore();
      const userRef = collection(db, "users");
      const userDocRef = doc(userRef, user.uid);

      let userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        active: user.active,
        zodiac: user.zodiac ?? 'capricorn',
        birthday: user.birthday ?? '2001-01-01',
        updatedAt: serverTimestamp(),
        latitude: user.latitude,
        longitude: user.longitude,
        altitude: user.altitude,
        altitudeAccuracy: user.altitudeAccuracy,
        heading: user.heading,
        speed: user.speed,
        accuracy: user.accuracy,
      };

      await setDoc(userDocRef, userData, {
        merge: true
      });

      context.commit("set_data", userData);
      context.commit('set_loggedIn', true)
    },

    async WRITE_NEW_EVENT(context, data) {
      const db = getDatabase();

      let uid = data.uid;

      // A post entry.
      const postData = {
        author: uid,
        summary: data.summary,
        lat: data.lat,
        lng: data.lng,
        timestamp: data.timestamp,
        type: data.type,
        timestamp: serverTimestamp(),
      };

      console.log(data);
      // Get a key for a new Post.
      const newPostKey = push(child(ref(db), 'posts')).key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      const updates = {};
      updates['/posts/' + newPostKey] = postData;
      updates['/user-posts/' + uid + '/' + newPostKey] = postData;

      return await update(ref(db), updates);
    }
  }
};
