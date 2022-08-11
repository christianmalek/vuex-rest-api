"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vapi = void 0;
var Store_1 = require("./Store");
var Resource_1 = require("./Resource");
var Vapi = /** @class */ (function () {
    function Vapi(options) {
        this.resource = new Resource_1.Resource(options);
        return this;
    }
    Vapi.prototype.get = function (options) {
        return this.add(Object.assign(options, { method: "get" }));
    };
    Vapi.prototype.delete = function (options) {
        return this.add(Object.assign(options, { method: "delete" }));
    };
    Vapi.prototype.head = function (options) {
        return this.add(Object.assign(options, { method: "head" }));
    };
    Vapi.prototype.options = function (options) {
        return this.add(Object.assign(options, { method: "options" }));
    };
    Vapi.prototype.post = function (options) {
        return this.add(Object.assign(options, { method: "post" }));
    };
    Vapi.prototype.put = function (options) {
        return this.add(Object.assign(options, { method: "put" }));
    };
    Vapi.prototype.patch = function (options) {
        return this.add(Object.assign(options, { method: "patch" }));
    };
    Vapi.prototype.add = function (options) {
        this.resource.add(options);
        return this;
    };
    Vapi.prototype.getStore = function (options) {
        if (options === void 0) { options = {}; }
        return (0, Store_1.createStore)(this.resource, options);
    };
    return Vapi;
}());
exports.Vapi = Vapi;
exports.default = Vapi;
