import Vue from "vue";
import Vuex from "vuex";
import createStore, { Resource } from "../vrap";

Vue.use(Vuex);

const resource = new Resource("posts", "https://jsonplaceholder.typicode.com", () => `/posts`)
  .addAction({
    action: "get",
    method: "get"
  });

const posts = createStore(resource.actions);
console.log(posts);

const store = new Vuex.Store({
  modules: {
    posts
  }
});

export default store;
