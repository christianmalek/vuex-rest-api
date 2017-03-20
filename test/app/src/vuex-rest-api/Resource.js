import axios from "axios";
export default class Resource {
    constructor(baseName, baseURL, state = {}) {
        this.actions = {};
        this.baseName = baseName;
        this.baseURL = baseURL;
        this.actions = {};
        this.state = state;
    }
    addAction(options) {
        options.requestConfig = options.requestConfig || {};
        const completePathFn = (params) => this.baseURL + options.pathFn(params);
        this.actions[options.action] = {
            requestFn: (params = {}, data = {}) => {
                console.log(params);
                if (["post", "put", "patch"].indexOf(options.method) > -1) {
                    return axios[options.method](completePathFn(params), data, options.requestConfig);
                }
                else {
                    return axios[options.method](completePathFn(params), options.requestConfig);
                }
            },
            mutationSuccessFn: options.mutationSuccessFn,
            mutationFailureFn: options.mutationFailureFn,
            baseName: this.baseName,
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