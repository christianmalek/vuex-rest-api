# Changelog 

(format is `dd.mm.yyyy`)

### 2.8.0 (04.07.2018)
- adding support for providing dynamic headers to requests (contributed by @rmaclean-ee, see https://github.com/christianmalek/vuex-rest-api/pull/66)

### 2.7.1 (03.07.2018)
- 🐛 fixed broken typescript definition for the `Store` interface. `Store.state` is now properly declared as `Object | Function` (see https://github.com/christianmalek/vuex-rest-api/issues/67).

### 2.7.0 (10.04.2018)
- 🐛 if `axios.defaults.baseURL` was set and it was no absolute URL it was appended twice (see https://github.com/christianmalek/vuex-rest-api/issues/60). See *baseURL from the constructor's options parameter in the README* for more info.

### 2.6.2 (10.04.2018)
- updated axios peer dependency to version 0.18.x

### 2.6.1 (12.02.2018)
- 🐛 removed axios from package.json dependencies (is peer dependency since 2.5.0)

### 2.6.0 (06.02.2018)
- changed `ResourceOptions.axios` to type `AxiosInstance` for better typescript support
- added property `ResourceAction.axios: AxiosInstance`
- the `onSuccess` and `onError` fns now provide their axios instance as third parameter. The method signatures look like the following: `method(state, payload, axios)`

### 2.5.0 (05.02.2018)
- `axios` is now a peer dependency.

### 2.4.4 (03.12.2017)
- 🐛 added `ShorthandResourceActionOptions` interface to avoid Typescript linting error "method options is required" for shorthand action methods (https://github.com/christianmalek/vuex-rest-api/issues/39)
- 🐛 declared baseUrl as optional in `ResourceOptions` interface

### 2.4.3 (03.12.2017)
- added Changelog
- updated axios dependency to version `0.17.1`
- set package.json dependencies to exact versions and removed ranged versioning to avoid errors due to wrong usage of semver
- added yarn and npm lock files to gitignore

### 2.4.2 (03.12.2017)
- made baseUrl officially optional (https://github.com/christianmalek/vuex-rest-api/pull/45)

### Changelog to Version 1
- `Resource` and `createStore` are now combined in the class `Vapi`
- `Resource.options.pathFn` renamed to `path`
- `path` can now also be a string (if no params are needed)
- `addAction` renamed to `add`
- shorthand methods for get, delete, post, put, patch
- `createStore` is removed, therefore `Vapi` has the method `getStore`
- `baseURL` is now part of the constructor's `options` object
- added option [createStateFn](#-createstatefn) to return the state as a function
- `property` is now [optional](#when-to-set-property-in-spite-of-its-optionality)
