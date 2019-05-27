/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import bcrypt from 'bcryptjs';
// eslint-disable-next-line import/no-cycle
import router from '../router';
import Firebase from '../firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    signedIn: false,
    campers: [],
    cabins: [],
    products: [],
  },
  getters: {},
  mutations: {
    signIn(state) {
      Vue.set(state, 'signedIn', true);
    },
    signOut(state) {
      Vue.set(state, 'signedIn', false);
    },
    SET_CAMPERS(state, payload) {
      Vue.set(state, 'campers', payload);
    },
    SET_CABINS(state, payload) {
      Vue.set(state, 'cabins', payload);
    },
  },
  actions: {
    async signIn({ commit }, payload) {
      const hashed = '$2a$10$WlGb2y3x9JhfjmUm5ispVegiAVj6J4vWG2aicVna2HzkQTmymXd4a';
      const isMatch = await bcrypt.compare(payload, hashed);
      if (isMatch) commit('signIn');
      router.push('/campers');
    },
    async getCampers({ commit }) {
      const campers = await Firebase.getCampers();
      commit('SET_CAMPERS', campers);
    },
    async getCabins({ commit }) {
      const cabins = await Firebase.getCabins();
      commit('SET_CABINS', cabins);
    },
  },
});
