import Vuex from "vuex"
import Vue from "vue"
import Vapi from "../../../../dist"

Vue.use(Vuex)

const posts =
  new Vapi({
    baseURL: "https://jsonplaceholder.typicode.com",
    state: {
      posts: []
    }
  })
    .get({
      action: "listPosts",
      property: "posts",
      path: "/posts"
    })
    .get({
      action: "getPost",
      property: "post",
      path: ({ id }) => `/posts/${id}`
    })
    .post({
      action: "updatePost",
      property: "post",
      path: ({ id }) => `/posts/${id}`
    })
    .getStore()

const store = new Vuex.Store({
  ...posts
})
export default store
