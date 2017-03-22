import axios from "axios";
export default class Resource {
    constructor(baseURL, state = {}) {
        this.actions = {};
        this.HTTPMethod = new Set(["get", "delete", "head", "post", "put", "patch"]);
        this.baseURL = baseURL;
        this.actions = {};
        this.state = state;
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
                if (["post", "put", "patch"].indexOf(options.method) > -1) {
                    return axios[options.method](completePathFn(params), data, options.requestConfig);
                }
                else {
                    return axios[options.method](completePathFn(params), options.requestConfig);
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
