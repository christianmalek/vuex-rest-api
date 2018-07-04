# vuex-rest-api

[![](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/vuejs/awesome-vue)
[![](https://img.shields.io/badge/vuex-2.x-brightgreen.svg)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/vuex-rest-api.svg)](https://www.npmjs.com/package/vuex-rest-api)
[![npm](https://img.shields.io/npm/dm/vuex-rest-api.svg)](https://www.npmjs.com/package/vuex-rest-api)

A Helper utility to simplify the usage of REST APIs with Vuex 2. Uses the popular HTTP client [axios](https://github.com/mzabriskie/axios) for requests. [Works](#usage-with-websanovavue-auth) with [websanova/vue-auth](https://github.com/websanova/vue-auth).

## Table of Contents

* [What is this good for](#what-is-this-good-for)
* [Installation](#installation)
* [Steps](#steps)
* [API](#api)
    * [constructor(options:Object):Vapi](#constructoroptionsobjectvapi)
    * [add(options):Vapi](#addoptionsvapi)
    * [getStore(options):Object](#getstoreoptionsobject)
* [Miscellaneous](#miscellaneous)
  * [Calling the actions](#calling-the-actions)
  * [Query params](#query-params)
  * [Add additional state, actions and mutations to the store](#add-additional-state-actions-and-mutations-to-the-store)
  * [Usage with websanova/vue\-auth](#usage-with-websanovavue-auth)
  * [Check error and loading state of requests](#check-error-and-loading-state-of-requests)
  * [Changelog](#changelog)

## What is this good for
If you want to connect a REST API with Vuex you'll find that there are a few repetitive steps. You need to request the data from the api (with an action) and set the state (via a mutation). This utility (for the sake of brevity called `Vapi` in the README) helps in *creating the store* by setting up the state, mutations and actions with a easy to follow pattern.

## It is **not** a middleware.
It's just a helper utility to help prepraring the store object for you. If there's something you don't like just overwrite the property.

## Installation
```bash
npm install vuex-rest-api
```

> Some notes: This readme assumes that you're using at least ES2015.

## Steps
1. Import `vuex-rest-api` (I called it `Vapi`).
1. Create a `Vapi` instance.  
   At least you have to set the base URL of the API you're requesting from. You can also define the default state. If you don't define a default state from a property it will default to `null`.
   In the example
1. Create the actions.  
   Each action represents a Vuex action. If it will be called (property `action`), it requests a specific API endpoint (property `path`) and sets the related property named `property` to the response's payload.
1. Create the store object
1. Pass it to Vuex. Continue reading [here](#calling-the-actions) to know how to *call the actions*.

```js
// store.js

import Vuex from "vuex"
import Vue from "vue"
// Step 1
import Vapi from "vuex-rest-api"

Vue.use(Vuex)

// Step 2
const posts = new Vapi({
  baseURL: "https://jsonplaceholder.typicode.com",
    state: {
      posts: []
    }
  })
  // Step 3
  .get({
    action: "getPost",
    property: "post",
    path: ({ id }) => `/posts/${id}`
  })
  .get({
    action: "listPosts",
    property: "posts",
    path: "/posts"
  })
  .post({
    action: "updatePost",
    property: "post",
    path: ({ id }) => `/posts/${id}`
  })
  // Step 4
  .getStore()

// Step 5
export const store = new Vuex.Store(posts)
```



## API
The following sections explain the API of the `Vapi` class.

### `constructor(options:Object):Vapi`

Creates a new `Vapi` instance and returns it.

```js
const vapi = new Vapi(options)
```

The parameter `options` consists of the following properties:

#### `# axios`
- **Type**: `axios` (instance)  
- **Default**: `axios` (instance)  
- **Usage**: The axios instance to use for the requests. This is pretty useful if you use a package like websanova/vue-auth which sets automatically the Authorization header. So you don't need to care. If you don't pass an instance, it will use the global axios instance.  

#### `# baseURL`
- **Type**: `string`
- **Usage**: The API's base URL without a specific endpoint's path. It's usage is optional. If you don't set it, it will use the base URL of the axios instance. Please note that `baseURL` has a higher priority than the baseURL set in the passed axios instance. You can also set base URL in the request config when you add an action. The priority is as following:

  `baseURL > axios instance base URL > request config base URL`
```js
{
  baseURL: "https://jsonplaceholder.typicode.com"
}
```

#### `# queryParams`  
- **Type**: `boolean` 
- **Default**: If you don't set a property's default value the value is `null`.  
- **Usage**: If you want to append the params to the request URL, set this property to true. You can also set this option in every action you need it if you don't need it for every action.
```js
{
  queryParams: true
}
```

#### `# state`
- **Type**: `Object`
- **Default**: Every property will default to `null`.
- **Usage**: The default state of your properties.  
```js
{
  state: {
    post: null, // this is unnecessary (default is null)
    posts: []
  }
}
```
Sets post to `null` and posts to an empty array.

### `add(options):Vapi`

Adds an action to access an API endpoint and returns the `Vapi` instance.

The parameter `options` consists of the following properties:

#### `# action` (required)
- **Type**: `string`  
- **Usage**: The name of the action.
```js
{
  action: "getPosts"
}
```

#### `# method`
- **Type**: `string`  
- **Default**: `"get"`  
- **Usage**: The HTTP method to request the API. Following HTTP Methods are allowed at the moment:
  - get
  - delete
  - head
  - post
  - put
  - patch

```js
{
  method: "get"
}
```

##### shorthand syntax
You can also use the http method instead of `add` to omit to set the `options.method` like this. This works with get, delete, post, put and patch:
```js
// regular way
vrap.add({
  method: "delete"
  // other options...  
})

//shorthand
vrap.delete({
  // other options...
})
```

#### `# property`
- **Type**: `string`
- **Default**: `null`
- **Usage**: The property of the state which should be automatically changed if the resolve is successfully.
```js
{
  property: "posts"
}
```

##### When to set `property` in spite of it's optionality
Sometimes you have to set the state by yourself. In that case you may consider to avoid setting `property`. Please consider the following consequences:

- `state.pending.<property name>` and `state.error.<property name>` won't be set. So you **can't** check these properties to see if the request is still pending or failed. Nevertheless you can still set the `onError` property to react to the error case.
- Because the property's name is unknown *vuex-rest-api* can't set the initial state for this property. You have to set the initial state by yourself.
- In the case of successful requests there will be nothing done with the payload. You have to set the `onSuccess` method to set the state (with the payload) by yourself.

#### `# path` (required)
- **Type**: `Function|string`  
- **Usage**: This property can either be a function or a path describing the rest of the API address (without the base URL).

##### Usage with a function
Here we pass a custom path function. This is necessary, because we also need to pass an id. Please note that *id* is passed in an object. This is necessary because you could pass multiple arguments.
```js
{
  path: ({id}) => `/post/${id}`
}
```

##### Usage with a string
Maybe the API endpoint needs no parameters. Then you can use a string like this:
```js
{
  path: "/posts"
}
```

#### `# headers`
- **Type**: `Function|Object`  
- **Usage**: This property allows to provide dynamic headers for every request. It can either be a function or an object.

##### Usage with a function
Here we pass a custom headers function. This allows us to change the extra headers for each request. The data has to be passed over the `params` bag.

> Please note that headers provided via this property will override it's counterpart you maybe set via `requestConfig.headers`.

```js
// setting the header
{
  headers: ({foo, bar}) => ({
      "FOO": foo,
      "BAR": bar
    })
}

// calling the mapped action and passing the data over the params object
this.getPosts({
  params: { 
    foo: "foo-header",
    bar: "bar-header"
  } 
})
```

##### Usage with a string
If the headers don't have to be evaluted on every request, just pass them via an object. Alternatively you could also set the headers via the `requestConfig.headers` property.
```js
{
  headers: {
    "FOO": "foo-header",
    "BAR": "bar-header"
  }
}
```

#### `# onSuccess`
- **Type**: `Function`  
- **Default**: `undefined`  
- **Usage**: This function will be called after successfully resolving the action. If you define this property, only the corresponding pending and error properties will be set, but not `state[property]`.
```js
{
  onSuccess: (state, payload, axios) => {
    // if you set the onSuccess function you have to set the state manually
    state.posts = payload.data
    state.post = payload.data[0]
  }
}
```

#### `# onError`
- **Type**: `Function`  
- **Default**: `undefined`  
- **Usage**: This function will be called if the action request fails. If you define this property, only the corresponding `pending` and `error` properties of the set `property` will be set, but not `state[property]`.
```js
{
  onError: (state, error, axios) => {
    Toast.showError(`Oops, there was following error: ${error}`)

    // if you set the onError function you have to set the state manually
    state.post = null
  }
}
```

#### `# requestConfig`
- **Type**: `Object`  
- **Default**: `{}`  
- **Usage**: An [`axios.requestConfig`](https://github.com/mzabriskie/axios#request-config) object. Please note that the passed HTTP method (see `options.method` above) won't be changed.
```js
{
  requestConfig: {
    //excerpt from (https://github.com/mzabriskie/axios#request-config)
    // `paramsSerializer` is an optional function in charge of serializing `params`
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'brackets'})
    },
  }
}
```

#### `# queryParams`
- **Type**: `boolean`  
- **Default**: `undefined`  
- **Usage**: If you want to append the params to the request URL, set this property to true.
```js
{
  queryParams: true
}
```

### `getStore(options):Object`

Creates an object you can pass to Vuex to add a store.

The parameter `options` consists of the following properties:

#### `# createStateFn`
- **Type**: `boolean`  
- **Default**: `false`
- **Usage**: Decides if the state should be returned as a function or an object. This option has to be changed if you want to share the state of your created store. Read chapter *module reuse* in the [Vuex documentation](https://vuex.vuejs.org/en/modules.html) for more details.
```js
{
  createStateFn: false
}
```

The returned object looks like this if you would call it with the settings of the example:
```js
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
    posts:   [],
    post:    null
  }),
  mutations: {
    LIST_POSTS:            Function,
    LIST_POSTS_SUCCEEDED:  Function,
    LIST_POSTS_FAILED:     Function,
    GET_POST:              Function,
    GET_POST_SUCCEEDED:    Function,
    GET_POST_FAILED:       Function,
    UPDATE_POST:           Function,
    UPDATE_POST_SUCCEEDED: Function,
    UPDATE_POST_FAILED:    Function
  },

  //every action's signatures is function(params, data)
  actions: {
    listPosts:  Function,
    getPost:    Function,
    updatePost: Function
  }
}
```

As you can see, it just created the store for us. No more, no less.

## Miscellaneous

### Calling the actions

Please respect the following function signature if you want to call an action:
```js
// direct via store
this.$store.dispatch("actionName", { params: {}, data: {} })

// or with mapActions
this.actionName({ params: {}, data: {} })`
```

`params` (optional) represents the data you passed to the `path` property.
`data` (optional) is your request's payload.

Please note that you **do not** have to set params, data or the enclosing object if you don't need them.

Examples:
- If you want to request all posts with the action `listPosts` and don't have any data or params, you could call it like this:

```js
// direct via store
this.$store.dispatch("listPosts")

// or with mapActions
this.listPosts()
```


- If you want to fetch a specific post with an parameter named *id* call one of the following:
```js
// direct via store
const params = { id: 42 }
this.$store.dispatch("getPost", { params })

// or with mapActions
this.getPost({ params })
```
  
- If you have an action where you have data and params to set, just do it like this:
```js
// direct via store
const params = { id: 42 }
const data = { content: "foobar" }
this.$store.dispatch("actionName", { params, data })

// or with mapActions
this.actionName({ params, data })
```

### Query params
If you want to use query params just set the `queryParams` property either in the constructor or the options from the add method. If you need it for just one action set it in the corresponding method. On the other hand, if you need it for all actions, set it in the constructor.

Please note that the method's `queryParams` property is *more specific* than the constructor's. So if you set `queryParams` in a method's options it will override the `queryParams` value of the constructor option!

Params will also be appended to the URL if you set a `paramsSerializer` function in the `requestConfig` property of the `add` method or if you pass an axios instance with set `paramsSerializer` function in the Resource constructor.

### Add additional state, actions and mutations to the store
As mentioned before, *vuex-rest-api* is just creating a regular store object. So you can add arbitrary actions, mutations and state properties to the store as written in the [Vuex documentation](https://vuex.vuejs.org/en/core-concepts.html):

```js
// resource creation hidden for the sake of brevity

// create the store
posts = postsResource.getStore()

// add a simple counter to the store
posts.state.counter = 0
posts.mutations.increment = state => {
  state.counter++
}
posts.actions.increment = context => {
  context.commit("increment")
}
```

### Usage with websanova/vue-auth

If you want to use this little helper with vue-auth you don't have to do anything. It will just work due to the fact that vue-auth uses the global axios instance. Don't pass any axios instance to Vapi and it will work.

### Check error and loading state of requests
`vuex-rest-api` sets for every property set in the `add()` method two different states:

- `state.pending.<propertyName>` (`true` when loading, otherwise `false`)
- `state.error.<propertyName>` (`null` if there's no error, otherwise it contains the error object)

This is really handy if you want to show a loading hint for specific requests or an error message:

```js
<template>
  <div>
    <ul>
      <li v-for="post in posts">{{post}}</li>
    </ul>
    <p v-if="pending.posts">loading posts...</p>
    <p v-if="error.posts">loading failed</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created() {
    this.getPosts()
  },

  // make states available
  computed: mapState({
    posts: state => state.posts.posts,
    pending: state => state.pending,
    error: state => state.error
  }),
  methods: {
    ...mapActions([
      "getPosts"
    ])
  }
}
</script>
```

### Changelog
see [CHANGELOG.md](CHANGELOG.md)
