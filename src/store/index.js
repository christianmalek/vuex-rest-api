import Vue from "vue";
import Vuex from "vuex";
import createStore, { Resource } from "../vrap";

Vue.use(Vuex);

const resource = new Resource("posts", "https://jsonplaceholder.typicode.com", () => `/posts`)
  .addAction({
    action: "list",
    method: "get"
  })
  .addAction({
    action: "get",
    method: "get",
    pathFn: ({ id }) => `/posts/${id}`,
    name: "post"
  });

const posts = createStore(resource);
console.log(posts);

const store = new Vuex.Store({
  modules: {
    posts
  }
});

export default store;
