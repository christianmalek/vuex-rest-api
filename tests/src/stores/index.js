import Vue from "vue"
import Vuex from "vuex"

import posts from "./posts"

Vue.use(Vuex)

export const state = {
  count: 0
}

export const mutations = {
  increment(state) {
    state.count++
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    posts
  }
})

export default store
