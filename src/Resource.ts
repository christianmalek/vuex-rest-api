import axios from "axios"

export interface ResourceAction {
  requestFn: Function,
  onSuccess: Function,
  onError: Function,
  property: string,
  dispatchString: string,
  commitString: string
}

export interface ResourceActionMap {
  [action: string]: ResourceAction
}

export interface ResourceActionOptions {
  action: string
  property?: string
  method: string
  path: Function | string
  onSuccess?: Function
  onError?: Function
  requestConfig?: Object
  queryParams?: Boolean
}

export interface ResourceOptions {
  baseURL: string,
  state?: Object,
  axios?: Object,
  queryParams?: Boolean
}

export class Resource {
  private baseURL: string
  private readonly HTTPMethod: Array<string> = ["get", "delete", "head", "options", "post", "put", "patch"]
  public actions: ResourceActionMap = {}
  public state: Object
  private axios: Object
  private queryParams: Boolean

  constructor(options: ResourceOptions) {
    this.baseURL = options.baseURL
    this.actions = {}
    this.state = options.state || {}
    this.axios = options.axios || axios
    this.queryParams = options.queryParams || false
  }

  add(options: ResourceActionOptions): Resource {
    options.method = options.method || "get"
    options.requestConfig = options.requestConfig || {}
    options.property = options.property || null

    if (this.HTTPMethod.indexOf(options.method) === -1) {
      const methods = this.HTTPMethod.join(", ")
      throw new Error(`Illegal HTTP method set. Following methods are allowed: ${methods}. You chose "${options.method}".`)
    }

    let completePathFn: Function
    if (typeof options.path === "function") {
      const pathFn: Function = options.path
      completePathFn = (params: Object) => this.baseURL + pathFn(params)
    }
    else {
      completePathFn = () => this.baseURL + options.path
    }

    this.actions[options.action] = {
      requestFn: (params: Object = {}, data: Object = {}) => {

        let queryParams
        // use action specific queryParams if set
        if (options.queryParams !== undefined) {
          queryParams = options.queryParams
          // otherwise use Resource-wide queryParams
        } else {
          queryParams = this.queryParams
        }

        const requestConfig = Object.assign({}, options.requestConfig)
        const paramsSerializer = options.requestConfig["paramsSerializer"] !== undefined ||
          this.axios["defaults"]["paramsSerializer"] !== undefined
        if (queryParams || paramsSerializer) {
          requestConfig["params"] = params
        }

        if (["post", "put", "patch"].indexOf(options.method) > -1) {
          return this.axios[options.method](completePathFn(params), data, requestConfig)
        } else {
          return this.axios[options.method](completePathFn(params), requestConfig)
        }
      },
      property: options.property,
      onSuccess: options.onSuccess,
      onError: options.onError,
      dispatchString: this.getDispatchString(options.action),
      commitString: this.getCommitString(options.action)
    }

    return this
  }

  private getDispatchString(action: string): string {
    return action
  }

  private getCommitString(action: string): string {
    const capitalizedAction: string = action.replace(/([A-Z])/g, "_$1").toUpperCase()
    return capitalizedAction
  }
}

export default Resource