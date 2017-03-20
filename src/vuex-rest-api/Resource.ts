import axios from "axios";

interface ResourceAction {
  pathFn: any,
  mutationSuccessFn: any,
  mutationFailureFn: any,
  baseName: string,
  name: string,
  dispatchString: string,
  commitString: string
}

export interface ResourceActionMap {
  [action: string]: ResourceAction;
}

export interface ResourceActionOptions {
  action: string;
  method: string;
  pathFn: Function;
  name?: string;
  mutationSuccessFn?: any;
  mutationFailureFn?: any;
}

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
    options.method = options.method.toLowerCase();

    const completePathFn = (params: Object) => this.baseURL + options.pathFn(params);

    this.actions[options.action] = {
      pathFn: (params: Object = {}) => {
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

  private getDispatchString(action: string, baseName: string, name: string): string {
    let actionName: string = "";
    if (name) {
      actionName = name[0].toUpperCase() + name.substring(1);
    } else {
      actionName = baseName[0].toUpperCase() + baseName.substring(1);
    }

    return `${action}${actionName}`;
  }

  private getCommitString(action: string, baseName: string, name: string): string {
    const mutationName: string = (name || baseName).replace(/([A-Z])/g, "_$1").toUpperCase();
    const capitalizedAction: string = action.toUpperCase();

    return `${capitalizedAction}_${mutationName}`;
  }
}
