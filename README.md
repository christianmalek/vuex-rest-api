# vuex-rest-api

[![](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/vuejs/awesome-vue)
[![](https://img.shields.io/badge/vuex-2.x-brightgreen.svg)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/vuex-rest-api.svg)](https://www.npmjs.com/package/vuex-rest-api)
[![npm](https://img.shields.io/npm/dm/vuex-rest-api.svg)](https://www.npmjs.com/package/vuex-rest-api)

A Helper utility to simplify the usage of REST APIs with Vuex 2. Uses the popular HTTP client [axios](https://github.com/mzabriskie/axios) for requests. [Works](#usage-with-websanovavue-auth) with [websanova/vue-auth](https://github.com/websanova/vue-auth).

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
1. Pass it to Vuex. Continue reading [here](https://christianmalek.github.io/vuex-rest-api/miscellaneous.html#calling-the-actions) to know how to *call the actions*.

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

## Minimal example 
Yep, here: https://codesandbox.io/s/8l0m8qk0q0

## API and further documentation
The docs are now available under http://vuex-rest-api.org
