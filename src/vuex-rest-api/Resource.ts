import axios from "axios";

interface ResourceAction {
  requestFn: Function,
  mutationSuccessFn: Function,
  mutationFailureFn: Function,
  baseName: string,
  dispatchString: string,
  commitString: string
}

export interface ResourceActionMap {
  [action: string]: ResourceAction;
}

export interface ResourceActionOptions {
  action: string;
  method: HTTPMethod;
  pathFn: Function;
  mutationSuccessFn?: Function;
  mutationFailureFn?: Function;
  requestConfig?: Object;
}

export type HTTPMethod = "get" | "delete" | "head" | "post" | "put" | "patch";

export default class Resource {
  private baseName: string;
  private baseURL: string;
  actions: ResourceActionMap = {};
  state: Object;

  constructor(baseName: string, baseURL: string, state: Object = {}) {
    this.baseName = baseName;
    this.baseURL = baseURL;
    this.actions = {};
    this.state = state;
  }

  addAction(options: ResourceActionOptions): Resource {
    options.requestConfig = options.requestConfig || {};
    const completePathFn = (params: Object) => this.baseURL + options.pathFn(params);

    this.actions[options.action] = {
      requestFn: (params: Object = {}, data: Object = {}) => {
        console.log(params)
        if (["post", "put", "patch"].indexOf(options.method) > -1) {
          return axios[options.method](completePathFn(params), data, options.requestConfig)
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

  private getDispatchString(action: string): string {
    return action;
  }

  private getCommitString(action: string): string {
    const capitalizedAction: string = action.replace(/([A-Z])/g, "_$1").toUpperCase();
    return capitalizedAction;
  }
}
