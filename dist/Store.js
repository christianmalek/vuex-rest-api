"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
var axios_1 = require("axios");
var cloneDeep = require("lodash.clonedeep");
var StoreCreator = /** @class */ (function () {
    function StoreCreator(resource, options) {
        this.successSuffix = "SUCCEEDED";
        this.errorSuffix = "FAILED";
        this.resource = resource;
        this.resource = resource;
        this.options = Object.assign({
            createStateFn: false,
            namespaced: false
        }, options);
        this.store = this.createStore();
    }
    StoreCreator.prototype.createState = function () {
        if (this.options.createStateFn) {
            return this.createStateFn();
        }
        else {
            return this.createStateObject();
        }
    };
    StoreCreator.prototype.createStateObject = function () {
        var resourceState = cloneDeep(this.resource.state);
        var state = Object.assign({
            pending: {},
            error: {},
            source: {},
        }, resourceState);
        var actions = this.resource.actions;
        Object.keys(actions).forEach(function (action) {
            var property = actions[action].property;
            // don't do anything if no property is set
            if (property === null) {
                return;
            }
            // if state is undefined set default value to null
            if (state[property] === undefined) {
                state[property] = null;
            }
            state["pending"][property] = false;
            state["error"][property] = null;
            state["source"][property] = null;
        });
        return state;
    };
    StoreCreator.prototype.createStateFn = function () {
        var _this = this;
        return function () {
            var resourceState = cloneDeep(_this.resource.state);
            var state = Object.assign({
                pending: {},
                error: {},
                source: {},
            }, resourceState);
            var actions = _this.resource.actions;
            Object.keys(actions).forEach(function (action) {
                var property = actions[action].property;
                // don't do anything if no property is set
                if (property === null) {
                    return;
                }
                // if state is undefined set default value to null
                if (state[property] === undefined) {
                    state[property] = null;
                }
                state["pending"][property] = false;
                state["error"][property] = null;
                state["source"][property] = null;
            });
            return state;
        };
    };
    StoreCreator.prototype.createGetter = function () {
        return {};
    };
    StoreCreator.prototype.createMutations = function (defaultState) {
        var _this = this;
        var mutations = {};
        var actions = this.resource.actions;
        Object.keys(actions).forEach(function (action) {
            var _a = actions[action], property = _a.property, commitString = _a.commitString, autoCancel = _a.autoCancel, beforeRequest = _a.beforeRequest, onSuccess = _a.onSuccess, onCancel = _a.onCancel, onError = _a.onError, axios = _a.axios;
            mutations["" + commitString] = function (state, requestConfig) {
                if (property !== null) {
                    state.pending[property] = true;
                    state.error[property] = null;
                    // If autoCancel is enabled and this property maps to a source state, cancel the current pending request.
                    if (autoCancel && state.source[property]) {
                        state.source[property].cancel();
                    }
                    // If the request config doesn't contain a cancel token, set one in state for convenience. We'll let the user
                    // provided token take precedence here though in case it's needed for a special controlled flow.
                    if (!requestConfig.cancelToken) {
                        var source = StoreCreator.CANCEL_TOKEN_PROVIDER.source();
                        state.source[property] = source;
                        requestConfig["cancelToken"] = source.token;
                    }
                }
                if (beforeRequest) {
                    beforeRequest(state, requestConfig);
                }
            };
            mutations[commitString + "_" + _this.successSuffix] = function (state, _a) {
                var payload = _a.payload, requestConfig = _a.requestConfig;
                if (property !== null) {
                    state.pending[property] = false;
                    state.error[property] = null;
                    state.source[property] = null;
                }
                if (onSuccess) {
                    onSuccess(state, payload, axios, requestConfig);
                }
                else if (property !== null) {
                    state[property] = payload.data;
                }
            };
            mutations[commitString + "_" + _this.errorSuffix] = function (state, _a) {
                var payload = _a.payload, requestConfig = _a.requestConfig;
                // Call onCancel if a cancellation error occurs, this can be helpful to let developers differentiate between
                // a normal error path and something separate for cancellation. It will also be called if autoCancel is enabled
                // where onError will not.
                var isCancellationErr = axios_1.default.isCancel(payload);
                if (typeof onCancel === 'function' && isCancellationErr) {
                    onCancel(state, payload, axios, requestConfig);
                }
                // The logic here is as follows: if either autoCancel is disabled or the error was not a cancellation error,
                // we'll prevent error handling and clean up. We'll assume that for most cases where autoCancel is useful,
                // we'll want to effectively suspend the lifetime of the pending state until a retry occurs.
                var shouldHandleErr = !autoCancel || !isCancellationErr;
                if (!shouldHandleErr) {
                    return;
                }
                if (property !== null) {
                    state.pending[property] = false;
                    state.error[property] = payload;
                    state.source[property] = null;
                }
                if (onError) {
                    onError(state, payload, axios, requestConfig);
                }
                else if (property !== null) {
                    // sets property to it's default value in case of an error
                    state[property] = defaultState[property];
                }
            };
        });
        return mutations;
    };
    StoreCreator.prototype.createActions = function () {
        var _this = this;
        var storeActions = {};
        var actions = this.resource.actions;
        Object.keys(actions).forEach(function (action) {
            var _a = actions[action], dispatchString = _a.dispatchString, commitString = _a.commitString, requestFn = _a.requestFn;
            storeActions[dispatchString] = function (_a, requestConfig) {
                var commit = _a.commit;
                if (requestConfig === void 0) { requestConfig = cloneDeep(StoreCreator.DEFAULT_REQUEST_CONFIG); }
                return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_b) {
                        if (!requestConfig.params)
                            requestConfig.params = {};
                        if (!requestConfig.data)
                            requestConfig.data = {};
                        commit(commitString, requestConfig);
                        return [2 /*return*/, requestFn(requestConfig)
                                .then(function (response) {
                                commit(commitString + "_" + _this.successSuffix, {
                                    payload: response,
                                    requestConfig: requestConfig
                                });
                                return Promise.resolve(response);
                            }, function (error) {
                                commit(commitString + "_" + _this.errorSuffix, {
                                    payload: error,
                                    requestConfig: requestConfig
                                });
                                return Promise.reject(error);
                            })];
                    });
                });
            };
        });
        return storeActions;
    };
    StoreCreator.prototype.createStore = function () {
        var state = this.createState();
        return {
            namespaced: this.options.namespaced,
            state: state,
            mutations: this.createMutations(state),
            actions: this.createActions()
        };
    };
    StoreCreator.CANCEL_TOKEN_PROVIDER = axios_1.default.CancelToken;
    StoreCreator.DEFAULT_REQUEST_CONFIG = { params: {}, data: {} };
    return StoreCreator;
}());
function createStore(resource, options) {
    return new StoreCreator(resource, options).store;
}
exports.createStore = createStore;
