import Vuex from "vuex"
import Vue from "vue"
import Vrex from "../../../../dist"

Vue.use(Vuex)

const posts =
  new Vrex({
    baseURL: "https://jsonplaceholder.typicode.com",
    state: {
      posts: []
    }
  })
    .get({
      action: "listPosts",
      property: "posts",
      path: () => `/posts`
    })
    .get({
      action: "getPost",
      property: "post",
      path: ({ id }) => `/posts/${id}`
    })
    .put({
      action: "updatePost",
      property: "post",
      path: ({ id }) => `/posts/${id}`
    })
    .getStore()

console.log(posts)

const store = new Vuex.Store({
  ...posts
})
export default store
