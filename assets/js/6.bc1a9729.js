(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{168:function(e,t,a){"use strict";a.r(t);var r=a(0),o=Object(r.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content"},[a("h1",{attrs:{id:"changelog"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#changelog","aria-hidden":"true"}},[e._v("#")]),e._v(" Changelog")]),e._v(" "),a("p",[e._v("(format is "),a("code",[e._v("dd.mm.yyyy")]),e._v(")")]),e._v(" "),a("h3",{attrs:{id:"_2-10-0-07-09-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-10-0-07-09-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.10.0 (07.09.2018)")]),e._v(" "),a("ul",[a("li",[e._v("added parameter "),a("code",[e._v("{ params, data}")]),e._v(" to "),a("code",[e._v("onSuccess")]),e._v(" and "),a("code",[e._v("onError")]),e._v(" functions (see readme for more info)")]),e._v(" "),a("li",[e._v("updated "),a("code",[e._v("typescript")]),e._v(" dev dependency to version 3.0.x")])]),e._v(" "),a("h3",{attrs:{id:"_2-9-0-12-08-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-9-0-12-08-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.9.0 (12.08.2018)")]),e._v(" "),a("ul",[a("li",[e._v("added "),a("code",[e._v("beforeRequest")]),e._v(" function to enable optimistic updates (contributed by @BorisTB, see https://github.com/christianmalek/vuex-rest-api/pull/71)")])]),e._v(" "),a("h3",{attrs:{id:"_2-8-0-04-07-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-8-0-04-07-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.8.0 (04.07.2018)")]),e._v(" "),a("ul",[a("li",[e._v("adding support for providing dynamic headers to requests (contributed by @rmaclean-ee, see https://github.com/christianmalek/vuex-rest-api/pull/66)")])]),e._v(" "),a("h3",{attrs:{id:"_2-7-1-03-07-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-7-1-03-07-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.7.1 (03.07.2018)")]),e._v(" "),a("ul",[a("li",[e._v("🐛 fixed broken typescript definition for the "),a("code",[e._v("Store")]),e._v(" interface. "),a("code",[e._v("Store.state")]),e._v(" is now properly declared as "),a("code",[e._v("Object | Function")]),e._v(" (see https://github.com/christianmalek/vuex-rest-api/issues/67).")])]),e._v(" "),a("h3",{attrs:{id:"_2-7-0-10-04-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-7-0-10-04-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.7.0 (10.04.2018)")]),e._v(" "),a("ul",[a("li",[e._v("🐛 if "),a("code",[e._v("axios.defaults.baseURL")]),e._v(" was set and it was no absolute URL it was appended twice (see https://github.com/christianmalek/vuex-rest-api/issues/60). See "),a("em",[e._v("baseURL from the constructor's options parameter in the README")]),e._v(" for more info.")])]),e._v(" "),a("h3",{attrs:{id:"_2-6-2-10-04-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-6-2-10-04-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.6.2 (10.04.2018)")]),e._v(" "),a("ul",[a("li",[e._v("updated axios peer dependency to version 0.18.x")])]),e._v(" "),a("h3",{attrs:{id:"_2-6-1-12-02-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-6-1-12-02-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.6.1 (12.02.2018)")]),e._v(" "),a("ul",[a("li",[e._v("🐛 removed axios from package.json dependencies (is peer dependency since 2.5.0)")])]),e._v(" "),a("h3",{attrs:{id:"_2-6-0-06-02-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-6-0-06-02-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.6.0 (06.02.2018)")]),e._v(" "),a("ul",[a("li",[e._v("changed "),a("code",[e._v("ResourceOptions.axios")]),e._v(" to type "),a("code",[e._v("AxiosInstance")]),e._v(" for better typescript support")]),e._v(" "),a("li",[e._v("added property "),a("code",[e._v("ResourceAction.axios: AxiosInstance")])]),e._v(" "),a("li",[e._v("the "),a("code",[e._v("onSuccess")]),e._v(" and "),a("code",[e._v("onError")]),e._v(" fns now provide their axios instance as third parameter. The method signatures look like the following: "),a("code",[e._v("method(state, payload, axios)")])])]),e._v(" "),a("h3",{attrs:{id:"_2-5-0-05-02-2018"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-5-0-05-02-2018","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.5.0 (05.02.2018)")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("axios")]),e._v(" is now a peer dependency.")])]),e._v(" "),a("h3",{attrs:{id:"_2-4-4-03-12-2017"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-4-03-12-2017","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.4.4 (03.12.2017)")]),e._v(" "),a("ul",[a("li",[e._v("🐛 added "),a("code",[e._v("ShorthandResourceActionOptions")]),e._v(' interface to avoid Typescript linting error "method options is required" for shorthand action methods (https://github.com/christianmalek/vuex-rest-api/issues/39)')]),e._v(" "),a("li",[e._v("🐛 declared baseUrl as optional in "),a("code",[e._v("ResourceOptions")]),e._v(" interface")])]),e._v(" "),a("h3",{attrs:{id:"_2-4-3-03-12-2017"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-3-03-12-2017","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.4.3 (03.12.2017)")]),e._v(" "),a("ul",[a("li",[e._v("added Changelog")]),e._v(" "),a("li",[e._v("updated axios dependency to version "),a("code",[e._v("0.17.1")])]),e._v(" "),a("li",[e._v("set package.json dependencies to exact versions and removed ranged versioning to avoid errors due to wrong usage of semver")]),e._v(" "),a("li",[e._v("added yarn and npm lock files to gitignore")])]),e._v(" "),a("h3",{attrs:{id:"_2-4-2-03-12-2017"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-2-03-12-2017","aria-hidden":"true"}},[e._v("#")]),e._v(" 2.4.2 (03.12.2017)")]),e._v(" "),a("ul",[a("li",[e._v("made baseUrl officially optional (https://github.com/christianmalek/vuex-rest-api/pull/45)")])]),e._v(" "),a("h3",{attrs:{id:"changelog-to-version-1"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#changelog-to-version-1","aria-hidden":"true"}},[e._v("#")]),e._v(" Changelog to Version 1")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("Resource")]),e._v(" and "),a("code",[e._v("createStore")]),e._v(" are now combined in the class "),a("code",[e._v("Vapi")])]),e._v(" "),a("li",[a("code",[e._v("Resource.options.pathFn")]),e._v(" renamed to "),a("code",[e._v("path")])]),e._v(" "),a("li",[a("code",[e._v("path")]),e._v(" can now also be a string (if no params are needed)")]),e._v(" "),a("li",[a("code",[e._v("addAction")]),e._v(" renamed to "),a("code",[e._v("add")])]),e._v(" "),a("li",[e._v("shorthand methods for get, delete, post, put, patch")]),e._v(" "),a("li",[a("code",[e._v("createStore")]),e._v(" is removed, therefore "),a("code",[e._v("Vapi")]),e._v(" has the method "),a("code",[e._v("getStore")])]),e._v(" "),a("li",[a("code",[e._v("baseURL")]),e._v(" is now part of the constructor's "),a("code",[e._v("options")]),e._v(" object")]),e._v(" "),a("li",[e._v("added option "),a("a",{attrs:{href:"#-createstatefn"}},[e._v("createStateFn")]),e._v(" to return the state as a function")]),e._v(" "),a("li",[a("code",[e._v("property")]),e._v(" is now "),a("a",{attrs:{href:"#when-to-set-property-in-spite-of-its-optionality"}},[e._v("optional")])])])])}],!1,null,null,null);o.options.__file="changelog.md";t.default=o.exports}}]);