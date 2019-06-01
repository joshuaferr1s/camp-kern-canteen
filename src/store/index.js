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
    addCamper(state, payload) {
      Vue.set(state, 'campers', [...state.campers, payload]);
    },
    updateCamper(state, payload) {
      const index = state.campers.findIndex(el => el.id === payload.id);
      Vue.set(state.campers, index, payload);
    },
    deleteCamper(state, payload) {
      const index = state.campers.findIndex(el => el.id === payload.id);
      Vue.delete(state.campers, index);
    },
    addCabin(state, payload) {
      Vue.set(state, 'cabins', [...state.cabins, payload]);
    },
    updateCabin(state, payload) {
      const index = state.cabins.findIndex(el => el.id === payload.id);
      Vue.set(state.cabins, index, payload);
    },
    deleteCabin(state, payload) {
      const index = state.cabins.findIndex(el => el.id === payload.id);
      Vue.delete(state.cabins, index);
    },
    addProduct(state, payload) {
      Vue.set(state, 'products', [...state.products, payload]);
    },
    updateProduct(state, payload) {
      const index = state.products.findIndex(el => el.id === payload.id);
      Vue.set(state.products, index, payload);
    },
    deleteProduct(state, payload) {
      const index = state.products.findIndex(el => el.id === payload.id);
      Vue.delete(state.products, index);
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
