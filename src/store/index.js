import Vue from "vue";
import Vuex from "vuex";
import createVrapPlugin from "../vrap";

Vue.use(Vuex);

const plugin = createVrapPlugin();

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count += 1;
    }
  },
  actions: {
    increment({ commit }) {
      commit("increment");
    }
  },
  plugins: [plugin]
});

export default store;
