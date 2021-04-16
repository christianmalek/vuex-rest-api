import Vue from "vue"
import Vuex from "vuex"

import posts from "./posts"
import cancel from "./cancel"

Vue.use(Vuex)
Vue.config.devtools = true

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
    posts,
    cancel
  }
})

export default store
