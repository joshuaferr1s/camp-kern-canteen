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
  getters: {
    camper: state => id => state.campers.find(el => el.id === id),
  },
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
    addCamper(state, payload) {
      Vue.set(state, 'campers', [...state.campers, payload]);
    },
    updateCamper(state, payload) {
      const index = state.campers.findIndex(el => el.name === payload.name);
      Vue.set(state.campers, index, payload);
    },
    deleteCamper(state, payload) {
      const index = state.campers.findIndex(el => el.name === payload.name);
      Vue.delete(state.campers, index);
    },
    addCabin(state, payload) {
      Vue.set(state, 'cabins', [...state.cabins, payload]);
    },
    updateCabin(state, payload) {
      const index = state.cabins.findIndex(el => el.cabin === payload.cabin);
      Vue.set(state.cabins, index, payload);
    },
    deleteCabin(state, payload) {
      const index = state.cabins.findIndex(el => el.cabin === payload.cabin);
      Vue.delete(state.cabins, index);
    },
  },
  actions: {
    async signIn({ commit }, payload) {
      const hashed = '$2a$10$WlGb2y3x9JhfjmUm5ispVegiAVj6J4vWG2aicVna2HzkQTmymXd4a';
      const isMatch = await bcrypt.compare(payload, hashed);
      if (isMatch) commit('signIn');
      router.push('/campers');
    },
    async getCabins({ commit }) {
      const cabins = await Firebase.getCabins();
      commit('SET_CABINS', cabins);
    },
  },
});
