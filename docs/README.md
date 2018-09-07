---
title: Introduction
---

[![](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/vuejs/awesome-vue)
![](https://img.shields.io/badge/vuex-2.x-brightgreen.svg)
![](https://img.shields.io/npm/dm/vuex-rest-api.svg)
[![npm](https://img.shields.io/npm/v/vuex-rest-api.svg)](https://www.npmjs.com/package/vuex-rest-api)


A Helper utility to simplify the usage of REST APIs with Vuex 2. Uses the popular HTTP client [axios](https://github.com/mzabriskie/axios) for requests. [Works](miscellaneous.html#usage-with-websanova-vue-auth) with [websanova/vue-auth](https://github.com/websanova/vue-auth).

## What is this good for
If you want to connect a REST API with Vuex you'll find that there are a few repetitive steps. You need to request the data from the api (with an action) and set the state (via a mutation). This utility (for the sake of brevity called `Vapi` in the README) helps in *creating the store* by setting up the state, mutations and actions with a easy to follow pattern.

## It is **not** a middleware.
It's just a helper utility to help prepraring the store object for you. If there's something you don't like just overwrite the property.

## Installation
```bash
npm install vuex-rest-api
```