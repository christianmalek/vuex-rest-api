import axios from "axios";
export default class Resource {
    constructor(baseName, baseURL, pathFn) {
        this.actions = {};
        this.baseName = baseName;
        this.baseURL = baseURL;
        this.pathFn = pathFn;
        this.actions = {};
    }
    addAction(options) {
        options.method = options.method.toLowerCase();
        const completePathFn = (params) => this.baseURL + (!options.pathFn ? this.pathFn(params) : options.pathFn(params));
        this.actions[options.action] = {
            requestFn: (params = {}) => {
                return axios[options.method](completePathFn(params));
            },
            mutationSuccessFn: options.mutationSuccessFn,
            mutationFailureFn: options.mutationFailureFn,
            baseName: this.baseName,
            name: options.name,
            dispatchString: this.getDispatchString(options.action, this.baseName, options.name),
            commitString: this.getCommitString(options.action, this.baseName, options.name)
        };
        return this;
    }
    getDispatchString(action, baseName, name) {
        let actionName = "";
        if (name) {
            actionName = name[0].toUpperCase() + name.substring(1);
        }
        else {
            actionName = baseName[0].toUpperCase() + baseName.substring(1);
        }
        return `${action}${actionName}`;
    }
    getCommitString(action, baseName, name) {
        const mutationName = (name || baseName).replace(/([A-Z])/g, "_$1").toUpperCase();
        const capitalizedAction = action.toUpperCase();
        return `${capitalizedAction}_${mutationName}`;
    }
}
//# sourceMappingURL=Resource.js.map