# vuex-rest-api

[![](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/vuejs/awesome-vue)
[![](https://img.shields.io/badge/vuex-2.x-brightgreen.svg)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/vuex-rest-api.svg)](https://www.npmjs.com/package/vuex-rest-api)
[![npm](https://img.shields.io/npm/dm/vuex-rest-api.svg)](https://www.npmjs.com/package/vuex-rest-api)

A Helper utility to simplify the usage of REST APIs with Vuex 2. Uses the popular HTTP client [axios](https://github.com/mzabriskie/axios) for requests. [Works](#usage-with-websanovavue-auth) with [websanova/vue-auth](https://github.com/websanova/vue-auth).

> The README doesn't show every feature. If you have any questions, don't hesitate to ask. =)

## Still in development
This piece of software is still work in progress. Error reports and improvement proposals are welcome!

## What is this good for
If you want to connect a REST API with Vuex you'll find that there are a few repetitive steps. You need to request the data from the api (with an action) and set the state (via a mutation). This utility helps in *creating the stores* by setting up the state, mutations and actions.

## It is **not** a middleware.
It's just a helper utility to create the store object for you. If there's something you don't like just overwrite it.

## Installation
```bash
npm install vuex-rest-api
```

# API

## Resource
The Resource class represents multiple properties which are necessary for the `createStore(resource)` function to create the state, mutations and actions.

### `Resource(baseURL: string, options: Object)`
Parameters:
- `baseURL`: The API URL without the path
- `options` has following properties:
```js
const options = {
  // OPTIONAL: The axios instace to use for the requests.
  // This is pretty useful if you use an package like websanova/vue-auth which
  // sets automatically the Authorization header. So you don't need to care.
  // If you don't pass an instance, it will use the global axios instance.
  axios: Object,
  // If you want to append the params to the request URL,
  // set this property to true. You can set this option also in
  // every single action if you don't need it for every action.
  queryParams: Boolean
}
```

### `addAction(options: Object)`
Adds an action to the resource object to access an API endpoint.

The `options` parameter has following properties:
```js
const options = {
  // REQUIRED: The name of the action.
  action: String,
  // REQUIRED: the HTTP method to request the API.
  // Following HTTP Methods are allowed at the moment:
  // get, delete, head, post, put, patch
  method: String,
  // REQUIRED: the property of the state which should
  // be automatically changed if the resolve is successfully.
  property: String,
  // The function which returns the rest of the API address (without the base URL).
  // The method signature is (params: Object).
  pathFn: Function,
  // This function will be called after successfully resolving the action.
  // If you define this property, only the corresponding
  // pending annmd error properties will be set, but not state[property].
  // The method signature is (state, error).
  mutationSuccessFn: Function,
  // This function will be called if the action request fails.
  // If you define this property, only the corresponding
  // pending and error properties will be set, but not state[property].
  // The method signature is (state, payload).
  mutationFailureFn: Function,
  // If you need a specific request config, you can here pass
  // an axios.requestConfig object. Please note that the passed
  // HTTP method (see 'method' above in this object) won't be changed.
  requestConfig: Function,
  // If you want to append the params to the request URL,
  // set this property to true.
  queryParams: Boolean
}
```

#### Example
Imagine you want to create a resource to request all posts and also specific posts from an REST API. The endpoint's addresses are

- `GET https://jsonplaceholder.typicode.com/posts` and
- `GET https://jsonplaceholder.typicode.com/posts/id`.

This is how it works:
```js
const resource = new Resource("https://api.com")
  .addAction({
    action: "listPosts",
    method: "get",
    property: "posts",
    pathFn: () => `/posts`
  })
  .addAction({
    action: "get",
    method: "get",
    property: "post",
    // Here we pass a custom path function. This is necessary, because we also
    // need to pass an id. Please note that *id* is passed in an object.
    // This is necessary because you could pass multiple arguments.
    pathFn: ({ id }) => `/posts/${id}`
    // If you pass a name, it will added as property to the state.
    // Dispatching this action will change the *post* state and not the *posts* state.
    // With this approach you can have multiple properties in the store's state.
});
```

Now the resource is ready to pass it to the `createStore` function to create a store. The returned object would look like this:

```js
// resource.actions
{
  state: {
    pending: {
      posts: false,
      post:  false
    },
    error: {
      posts: null,
      post:  null
    },
    posts:   null,
    post:    null
  },
  mutations: {
    LIST_POSTS:           (...),
    LIST_POSTS_SUCCEEDED: (...),
    LIST_POSTS_FAILED:    (...),
    GET_POST:             (...),
    GET_POST_SUCCEEDED:   (...),
    GET_POST_FAILED:      (...)
  },
  actions: {
    listPosts: (),
    getPost: (...)
  }
}
```
As you can see, it just created the store for us. No more, no less.

#### Calling the actions
If you want to request all posts, you just need to dispatch the `listPosts()` action and to fetch a specific post call `getPost({id})`. Don't forget to pass the necessary object and properties defined in the corresponding `pathFn` function, e.g. if you want to call `getPost`, and want to pass an arbitrary parameter, call it like `getPost({params: {someParam: 5, anotherParam: "foo"}})`.

#### Pass data
If you need to pass data, just pass an object as second parameter like `updatePost({params: {id: 5}, data:{name: "changedName", creator: "changedCreator"}})`.

The function signature looks like this: `actionName({params: {}, data: {}})`

#### Query params
If you want to use query params just set the `queryParams` property. If you need it for just one action set it in the action options object. On the other hand, if you need it for all actions, set it in the Resource's options object.

Please note that the Action's `queryParams` property is *more specific* than the Resource's. So if you set `queryParams` in an Action it will override the `queryParams` value of the Resource option!

Params will also be appended to the URL if you set a `paramsSerializer` function in the `requestConfig` property of the `addAction` method or if you pass an axios instance with set `paramsSerializer` function in the Resource constructor.


## createStore(resource: Resource)
This function will create an object you can pass to Vuex to add a store.

#### Example
```js
import Vue from "vue";
import Vuex from "vuex";
// 1. Import vuex-rest-api.
import { createStore, Resource } from "vuex-rest-api";

Vue.use(Vuex);

// 2. Create the resource object.
const resource = new Resource("https://jsonplaceholder.typicode.com")
  .addAction({
    action: 'listPosts',
    method: 'get',
    property: "posts",
    pathFn: () => `/posts`
  })
  .addAction({
    action: 'getPost',
    method: 'get',
    property: "posts",
    pathFn: ({ id }) => `/posts/${id}`
  })
  .addAction({
    action: 'updatePost',
    method: 'put',
    property: "post",
    pathFn: ({ id }) => `/posts/${id}`
  })
  .addAction({
    action: 'deletePost',
    method: 'delete',
    property: "post",
    pathFn: ({ id }) => `/posts/${id}`
  })

// 3. Create the store object.
const posts = createStore(resource);

const store = new Vuex.Store({
  modules: {
    // 4. Pass the store object to Vuex. (It doesn't need to be a module.)
    posts
  }
});

export default store;
```

And use it in your Vue app!
```html
<template>
  <div id="app">
    <h1>Vrap Test</h1>
    <code>{{posts}}</code>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "./store/";

export default {
  name: 'app',
  computed: {
    ...mapState([
      "posts",
    ])
  },
  store,
  methods: {
    ...mapActions([
      "getPost",
      "listPosts"
    ])
  },
  mounted() {
    this.getPost({ params: { id: 2 } });
    this.list_posts();
    this.updatePost({ params: { id: 7 }, data: { text: "lorem ipsum dolore"}});
  }
};
</script>
```

#### Usage with websanova/vue-auth
If you want to use this little helper with vue-auth you need to use vue-axios. Just follow the steps of both readme's. Then just pass the instance axios to the Resource object:

```js
import Vue from "vue";

const options = {
  //this works only if you registered axios with vue-axios before
  axios: Vue.axios
}

// pass options to the resource constructor
const resource = new Resource("https://api.com", options);

// now you can create the actions as is usual
resource.addActions(...)
```
