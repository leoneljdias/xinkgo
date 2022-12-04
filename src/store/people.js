import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    all: [],
  },
  mutations: {
    setPeople(state, people) {
      state.all = people
    },
  },
  actions: {

    async GET_ALL(context) {
      let users = [];
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((_user) => {
        let userData = _user.data();
        let user = {};
        user.uid = userData.uid;
        user.zodiac = userData.zodiac ?? 'capricorn',
        user.birthday = userData.birthday ?? '2001-01-01',
        user.longitude = userData.longitude;
        user.latitude = userData.latitude;
        user.bio = userData.bio ?? "Olá, sou novo aqui. Ainda não tenho bio";
        user.displayName = userData.displayName;
        user.photoURL = userData.photoURL;
        users.push(user);
      });

      context.commit("setPeople", users);
    }
  }
};
