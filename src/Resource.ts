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
  queryParams?: Boolean;
}

export interface ResourceOptions {
  state?: Object,
  axios?: Object,
  queryParams?: Boolean;
}

export default class Resource {
  private baseURL: string;
  private HTTPMethod = new Set(["get", "delete", "head", "post", "put", "patch"]);
  public actions: ResourceActionMap = {};
  public state: Object;
  private axios: Object;
  private queryParams: Boolean;

  constructor(baseURL: string, options: ResourceOptions = {}) {
    this.baseURL = baseURL;
    this.actions = {};
    this.state = options.state || {};
    this.axios = options.axios || axios;
    this.queryParams = options.queryParams || false;
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

        let queryParams;
        // use action specific queryParams if set
        if (options.queryParams !== undefined) {
          queryParams = options.queryParams;
        // otherwise use Resource-wide queryParams
        } else {
          queryParams = this.queryParams;
        }

        const requestConfig = Object.assign({}, options.requestConfig);
        if (queryParams || options.requestConfig["paramsSerializer"] !== undefined) {
          requestConfig["params"] = params;
        }

        if (["post", "put", "patch"].indexOf(options.method) > -1) {
          return this.axios[options.method](completePathFn(params), data, requestConfig);
        } else {
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

  private getDispatchString(action: string): string {
    return action;
  }

  private getCommitString(action: string): string {
    const capitalizedAction: string = action.replace(/([A-Z])/g, "_$1").toUpperCase();
    return capitalizedAction;
  }
}
