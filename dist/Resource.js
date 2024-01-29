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
            throw new Error("Illegal HTTP method set. Following methods are allowed: ".concat(methods, ". You chose \"").concat(options.method, "\"."));
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
            requestFn: function (params, data, requestHeaders) {
                if (params === void 0) { params = {}; }
                if (data === void 0) { data = {}; }
                if (requestHeaders === void 0) { requestHeaders = null; }
                var queryParams;
                // use action specific queryParams if set
                if (options.queryParams !== undefined) {
                    queryParams = options.queryParams;
                    // otherwise use Resource-wide queryParams
                }
                else {
                    queryParams = _this.queryParams;
                }
                var requestConfig = Object.assign({}, options.requestConfig);
                var paramsSerializer = options.requestConfig["paramsSerializer"] !== undefined ||
                    _this.axios.defaults.paramsSerializer !== undefined;
                if (queryParams || paramsSerializer) {
                    requestConfig["params"] = params;
                }
                if (headersFn) {
                    if (requestConfig["headers"]) {
                        Object.assign(requestConfig["headers"], headersFn(params));
                    }
                    else {
                        requestConfig["headers"] = headersFn(params);
                    }
                }
                if (requestHeaders) {
                    if (requestConfig["headers"]) {
                        Object.assign(requestConfig["headers"], requestHeaders);
                    }
                    else {
                        requestConfig["headers"] = requestHeaders;
                    }
                }
                // This is assignment is made to respect the priority of the base URL, url, method and data.
                // It is as following: baseURL > axios instance base URL > request config base URL
                var fullRequestConfig = Object.assign({
                    method: options.method,
                    url: urlFn(params),
                    baseURL: _this.normalizedBaseURL,
                    data: data
                }, requestConfig);
                return _this.axios.request(fullRequestConfig);
            },
            property: options.property,
            beforeRequest: options.beforeRequest,
            onSuccess: options.onSuccess,
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
