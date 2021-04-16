"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
var axios_1 = require("axios");
var Resource = /** @class */ (function () {
    function Resource(options) {
        this.HTTPMethod = ["get", "delete", "head", "options", "post", "put", "patch"];
        this.actions = {};
        this.baseURL = options.baseURL;
        this.actions = {};
        this.state = options.state || {};
        this.axios = options.axios || axios_1.default;
        this.queryParams = options.queryParams || false;
    }
    Resource.prototype.add = function (options) {
        var _this = this;
        options.method = options.method || "get";
        options.requestConfig = options.requestConfig || {};
        options.property = options.property || null;
        var headersFn = this.getHeadersFn(options);
        if (this.HTTPMethod.indexOf(options.method) === -1) {
            var methods = this.HTTPMethod.join(", ");
            throw new Error("Illegal HTTP method set. Following methods are allowed: " + methods + ". You chose \"" + options.method + "\".");
        }
        var urlFn;
        if (typeof options.path === "function") {
            var pathFn_1 = options.path;
            urlFn = function (params) { return pathFn_1(params); };
        }
        else {
            urlFn = function () { return options.path; };
        }
        this.actions[options.action] = {
            requestFn: function (requestConfig) {
                var tmpRequestConfig = Object.assign({}, requestConfig, options.requestConfig);
                var params = tmpRequestConfig.params;
                if (headersFn) {
                    if (tmpRequestConfig["headers"]) {
                        Object.assign(tmpRequestConfig["headers"], headersFn(params));
                    }
                    else {
                        tmpRequestConfig["headers"] = headersFn(params);
                    }
                }
                var queryParams;
                // use action specific queryParams if set
                if (options.queryParams !== undefined) {
                    queryParams = options.queryParams;
                    // otherwise use Resource-wide queryParams
                }
                else {
                    queryParams = _this.queryParams;
                }
                // If the queryParams config is disabled omit params in fullRequestConfig. This is to keep changes around
                // passing in a complete AxiosRequestConfig backwards compatible with previous versions of the library where
                // the ActionParams partial was used.
                if (!queryParams) {
                    tmpRequestConfig["params"] = {};
                }
                // This assignment is made to respect the priority of the base URL, url, method.
                // It is as following: baseURL > axios instance base URL > request config base URL
                var fullRequestConfig = Object.assign({
                    method: options.method,
                    url: urlFn(params),
                    baseURL: _this.normalizedBaseURL,
                }, tmpRequestConfig);
                return _this.axios.request(fullRequestConfig);
            },
            property: options.property,
            autoCancel: options.autoCancel,
            beforeRequest: options.beforeRequest,
            onSuccess: options.onSuccess,
            onCancel: options.onCancel,
            onError: options.onError,
            dispatchString: this.getDispatchString(options.action),
            commitString: this.getCommitString(options.action),
            axios: this.axios
        };
        return this;
    };
    Resource.prototype.getHeadersFn = function (options) {
        if (options.headers) {
            if (typeof options.headers === "function") {
                var headersFunction_1 = options.headers;
                return function (params) { return headersFunction_1(params); };
            }
            else {
                return function () { return options.headers; };
            }
        }
        return null;
    };
    Object.defineProperty(Resource.prototype, "normalizedBaseURL", {
        get: function () {
            return this.baseURL || this.axios.defaults.baseURL || "";
        },
        enumerable: false,
        configurable: true
    });
    Resource.prototype.getDispatchString = function (action) {
        return action;
    };
    Resource.prototype.getCommitString = function (action) {
        var capitalizedAction = action.replace(/([A-Z])/g, "_$1").toUpperCase();
        return capitalizedAction;
    };
    return Resource;
}());
exports.Resource = Resource;
exports.default = Resource;
