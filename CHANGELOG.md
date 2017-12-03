# Changelog

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
