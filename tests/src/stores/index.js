import Vue from "vue"
import Vuex from "vuex"

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
  mutations
})

export default store
