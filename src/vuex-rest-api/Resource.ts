import axios from "axios";

interface ResourceAction {
  requestFn: Function,
  mutationSuccessFn: Function,
  mutationFailureFn: Function,
  property: string,
  dispatchString: string,
  commitString: string
}

export interface ResourceActionMap {
  [action: string]: ResourceAction;
}

export interface ResourceActionOptions {
  action: string;
  property: string;
  method: string;
  pathFn: Function;
  mutationSuccessFn?: Function;
  mutationFailureFn?: Function;
  requestConfig?: Object;
}

export default class Resource {
  private baseURL: string;
  actions: ResourceActionMap = {};
  state: Object;
  private HTTPMethod = new Set(["get", "delete", "head", "post", "put", "patch"]);

  constructor(baseURL: string, state: Object = {}) {
    this.baseURL = baseURL;
    this.actions = {};
    this.state = state;
  }

  addAction(options: ResourceActionOptions): Resource {
    options.method = options.method || "get";
    options.requestConfig = options.requestConfig || {};

    if (!options.property) {
      throw new Error("'property' field must be set.");
    }

    if (this.HTTPMethod.has(options.method) === false) {
      const methods = [...this.HTTPMethod.values()].join(", ");
      throw new Error(`Illegal HTTP method set. Following methods are allowed: ${methods}`)
    }

    const completePathFn = (params: Object) => this.baseURL + options.pathFn(params);

    this.actions[options.action] = {
      requestFn: (params: Object = {}, data: Object = {}) => {
        if (["post", "put", "patch"].indexOf(options.method) > -1) {
          return axios[options.method](completePathFn(params), data, options.requestConfig)
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

  private getDispatchString(action: string): string {
    return action;
  }

  private getCommitString(action: string): string {
    const capitalizedAction: string = action.replace(/([A-Z])/g, "_$1").toUpperCase();
    return capitalizedAction;
  }
}
