import axios from "axios";
export default class Resource {
    constructor(baseURL, options = {}) {
        this.HTTPMethod = new Set(["get", "delete", "head", "post", "put", "patch"]);
        this.actions = {};
        this.baseURL = baseURL;
        this.actions = {};
        this.state = options.state || {};
        this.axios = options.axios || axios;
        this.queryParams = options.queryParams || false;
    }
    addAction(options) {
        options.method = options.method || "get";
        options.requestConfig = options.requestConfig || {};
        if (!options.property) {
            throw new Error("'property' field must be set.");
        }
        if (this.HTTPMethod.has(options.method) === false) {
            const methods = [...this.HTTPMethod.values()].join(", ");
            throw new Error(`Illegal HTTP method set. Following methods are allowed: ${methods}`);
        }
        const completePathFn = (params) => this.baseURL + options.pathFn(params);
        this.actions[options.action] = {
            requestFn: (params = {}, data = {}) => {
                let queryParams;
                // use action specific queryParams if set
                if (options.queryParams !== undefined) {
                    queryParams = options.queryParams;
                    // otherwise use Resource-wide queryParams
                }
                else {
                    queryParams = this.queryParams;
                }
                const requestConfig = Object.assign({}, options.requestConfig);
                const paramsSerializer = options.requestConfig["paramsSerializer"] !== undefined ||
                    this.axios["defaults"]["paramsSerializer"] !== undefined;
                if (queryParams || paramsSerializer) {
                    requestConfig["params"] = params;
                }
                console.log("test", this.axios["defaults"]);
                if (["post", "put", "patch"].indexOf(options.method) > -1) {
                    return this.axios[options.method](completePathFn(params), data, requestConfig);
                }
                else {
                    return this.axios[options.method](completePathFn(params), requestConfig);
                }
            },
            property: options.property,
            mutationSuccessFn: options.mutationSuccessFn,
            mutationFailureFn: options.mutationFailureFn,
            dispatchString: this.getDispatchString(options.action),
            commitString: this.getCommitString(options.action)
        };
        return this;
    }
    getDispatchString(action) {
        return action;
    }
    getCommitString(action) {
        const capitalizedAction = action.replace(/([A-Z])/g, "_$1").toUpperCase();
        return capitalizedAction;
    }
}
//# sourceMappingURL=Resource.js.map