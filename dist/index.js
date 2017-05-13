"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Store_1 = require("./Store");
var Resource_1 = require("./Resource");
var Vrex = (function () {
    function Vrex(options) {
        this.resource = new Resource_1.Resource(options);
        return this;
    }
    Vrex.prototype.get = function (options) {
        return this.add(Object.assign(options, { method: "get" }));
    };
    Vrex.prototype.delete = function (options) {
        return this.add(Object.assign(options, { method: "delete" }));
    };
    Vrex.prototype.post = function (options) {
        return this.add(Object.assign(options, { method: "post" }));
    };
    Vrex.prototype.put = function (options) {
        return this.add(Object.assign(options, { method: "put" }));
    };
    Vrex.prototype.patch = function (options) {
        return this.add(Object.assign(options, { method: "patch" }));
    };
    Vrex.prototype.add = function (options) {
        this.resource.add(options);
        return this;
    };
    Vrex.prototype.getStore = function () {
        return Store_1.createStore(this.resource);
    };
    return Vrex;
}());
exports.Vrex = Vrex;
exports.default = Vrex;
