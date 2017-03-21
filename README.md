# vuex-rest-api

A Helper utility to simplify the usage of REST APIs with Vuex. Uses the popular HTTP client [axios](https://github.com/mzabriskie/axios) for requests.

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

## Vrap.Resource
The Resource class represents multiple properties which are necessary for the `createStore(resource)` function to create the state, mutations and actions.

### `Resource(baseURL, state)`
Parameters:
- `baseURL`: The API URL without the path
- `state`: The function which defines the API resource wihout the `baseURL`

### `addAction(options)`
> Adds an action to the resource object to access an API endpoint.
Parameters:
You need to pass an object with following properties:
```js
const options = {
  // REQUIRED: The name of the action.
  action: string,
  // REQUIRED: the HTTP method to request the API.
  // Following HTTP Methods are allowed at the moment:
  // get, delete, head, post, put, patch
  method: string,
  // REQUIRED: the property of the state which should
  // be automatically changed if the resolve is successfully.
  property: string,
  // The function which describes the string interpolation if the path
  // differs from requestFn described in the Resource constructor.
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
  // method (see above in this object) won't be changed.
  requestConfig: Function
}
```

#### Example
Imagine you want to create a resource to request all posts and also specific posts from an REST API. The endpoint's addresses are `GET https://jsonplaceholder.typicode.com/posts` and `GET https://jsonplaceholder.typicode.com/posts/id`. This is how it works:

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

Now the resource is ready to pass it to the `createStore` function and create a store. The resource's *actions* look like this:

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
    LIST_POSTS_FAIELD:    (...),
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
#### Calling the actions
If you want to request all posts, you just need to dispatch the `listPosts()` action and to fetch a specific post call `getPost({id})`. Don't forget to pass the necessary object and properties defined in the corresponding `pathFn` function, e.g. if you want to call `getPost`, and want to pass an arbitrary parameter, call it like `getPost({someParam: 5, anotherParam: "foo"})`.

If you need to pass also a body, just pass an object as second parameter like `updatePost({id: 5}, {name: "changedName", creator: "changedCreator"})`.

## Vrap.createStore(resource)
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
    // this.list_posts();
  }
};
</script>
```
