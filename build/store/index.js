import Vue from "vue";
import Vuex from "vuex";
import { createStore, Resource } from "../vuex-rest-api/StoreCreator";
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
//# sourceMappingURL=index.js.map