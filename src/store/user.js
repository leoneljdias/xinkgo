import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";


export default {
  state: {
    loggedIn: false,
    data: null
  },
  getters: {
    user(state) {
      return state.user
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.loggedIn = value;
    },
    SET_USER(state, data) {
      state.data = data;
    }
  },
  actions: {
    async register(context, {
      email,
      password,
      name
    }) {
      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(auth, email, password)
      if (response) {
        context.commit('SET_USER', response.user)
        response.user.updateProfile({
          displayName: name
        })
      } else {
        throw new Error('Unable to register user')
      }
    },

    async logIn(context, {
      email,
      password
    }) {
      const auth = getAuth();
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
        context.commit('SET_USER', response.user)
      } else {
        throw new Error('login failed')
      }
    },

    async facebook(context) {
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      const response = await signInWithPopup(auth, provider)
      if (response) {
        context.commit('SET_USER', response.user)
      } else {
        throw new Error('login failed')
      }
    },

    async google(context) {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider)
      if (response) {
        context.commit('SET_USER', response.user)
      } else {
        throw new Error('login failed')
      }
    },

    async twitter(context) {
      const auth = getAuth();
      const provider = new TwitterAuthProvider();
      const response = await signInWithPopup(auth, provider)
      if (response) {
        context.commit('SET_USER', response.user)
      } else {
        throw new Error('login failed')
      }
    },

    async logOut(context) {
      const auth = getAuth();
      await signOut(auth)
      context.commit('SET_USER', null)
    },

    async fetchUser(context, user) {
      context.commit("SET_LOGGED_IN", user !== null);
      if (user) {
        context.commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        context.commit("SET_USER", null);
      }
    }
  }
};
