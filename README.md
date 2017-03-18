# vuex-rest-api

Helper utility to simplify the usage of REST APIs with Vuex. Uses the popular HTTP client [axios](https://github.com/mzabriskie/axios) for requests.

## Still in development
This piece of software is still work in progress. Error reports and improvement proposals are welcome!

## What is this good for
If you want to connect a REST API with Vuex you'll find that there are a few repetitive steps. You need to request the data from the api (with an action) and set the state (via a mutation). This utility helps in *creating the stores* by setting up the state, mutations and actions. It is **not** a middleware.

## Installation
```bash
npm install vuex-rest-api
```

## Example
In this example we want to access the *posts* API endpoint from https://jsonplaceholder.typicode.com.
If you want to use vuex-rest-api just take the following steps:

```js
// store/index.js

import Vue from "vue";
import Vuex from "vuex";

// 1. Import the createStore function and the Resource class.
import createStore, { Resource } from "vrap";

Vue.use(Vuex);

// 2. Create a new resource.
const resource = new Resource("posts", "https://jsonplaceholder.typicode.com", () => `/posts`)
  // 3. Add an action.
  .addAction({
    action: "list",
    method: "get"
  })
  // 3,. Add another action.
  .addAction({
    action: "get",
    method: "get",
    pathFn: ({ id }) => `/posts/${id}`,
    name: "post"
  });

const store = new Vuex.Store({
  modules: {
    // 4. Add the store to your Vuex store. That's all :)
    posts: createStore(resource)
  }
});

export default store;
```

Now you can access the Store in your Vue application like this (the map functions aren't necessary, but make the store access easier):
```js
// App.js
import { mapActions, mapState } from "vuex";
import store from "./store/";

export default {
  name: 'app',
  store,
  computed: {
    ...mapState([
      "posts",
    ])
  },
  methods: {
    ...mapActions([
      "getPost",
      "listPosts"
    ]),
  },
  mounted() {
    // It is neccessarry to pass the params like the following.
    this.getPost({ params: { id: 2 } });
  }
};
```
