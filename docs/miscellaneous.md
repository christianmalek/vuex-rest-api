# Miscellaneous

## Calling the actions

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

## Add additional state, actions and mutations to the store
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

## Usage with websanova/vue-auth

If you want to use this little helper with vue-auth you don't have to do anything. It will just work due to the fact that vue-auth uses the global axios instance. Don't pass any axios instance to Vapi and it will work.

## Check error and loading state of requests
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

## Nuxt

*Thanks goes out to [*appinteractive*](https://github.com/appinteractive) for finding out how to use vuex-rest-api with nuxt.*

If you want to use vuex-rest-api with nuxt you can do it like the following:

1. Install the nuxt axios module: https://axios.nuxtjs.org/setup

2. Write a plugin and register it in your nuxt application.
```js
// plugins/init-store-modules.js
export default async ({store, app}) => {
  await store.dispatch('initStoreModules', {store: store, axios: app.$axios})
}
```

3. Create the store and define the `initStoreModules` action. That's all!
```js
// store/index.js

import Vuex from 'vuex'
import userStore from './users'

const createStore = () => {
  return new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
      async initStoreModules ({state}, {store, axios}) {
        // see https://vuex.vuejs.org/api/#registermodule for more details
        await store.registerModule('users', userStore(axios));
      }
    }
  })
}

export default createStore
```