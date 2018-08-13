---
title: Introduction
---
## What is this good for
If you want to connect a REST API with Vuex you'll find that there are a few repetitive steps. You need to request the data from the api (with an action) and set the state (via a mutation). This utility (for the sake of brevity called `Vapi` in the README) helps in *creating the store* by setting up the state, mutations and actions with a easy to follow pattern.

## It is **not** a middleware.
It's just a helper utility to help prepraring the store object for you. If there's something you don't like just overwrite the property.

## Installation
```bash
npm install vuex-rest-api
```