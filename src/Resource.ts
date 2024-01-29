import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

export interface ResourceAction {
  requestFn: Function,
  beforeRequest: Function,
  onSuccess: Function,
  onError: Function,
  property: string,
  dispatchString: string,
  commitString: string,
  axios: AxiosInstance,
}

export interface ResourceActionMap {
  [action: string]: ResourceAction
}

export interface ShorthandResourceActionOptions {
  action: string
  property?: string
  path: Function | string
  beforeRequest?: Function
  onSuccess?: Function
  onError?: Function
  requestConfig?: Object
  queryParams?: Boolean
  headers?: Function | Object
}

export interface ResourceActionOptions extends ShorthandResourceActionOptions {
  method: string
}

export interface ResourceOptions {
  baseURL?: string,
  state?: Object,
  axios?: AxiosInstance,
  queryParams?: Boolean
}

export class Resource {
  private baseURL: string
  private readonly HTTPMethod: Array<string> = ["get", "delete", "head", "options", "post", "put", "patch"]
  public actions: ResourceActionMap = {}
  public state: Object
  public axios: AxiosInstance
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
    const headersFn = this.getHeadersFn(options);

    if (this.HTTPMethod.indexOf(options.method) === -1) {
      const methods = this.HTTPMethod.join(", ")
      throw new Error(`Illegal HTTP method set. Following methods are allowed: ${methods}. You chose "${options.method}".`)
    }

    let urlFn: Function
    if (typeof options.path === "function") {
      const pathFn: Function = options.path
      urlFn = (params: Object) => pathFn(params)
    } else {
      urlFn = () => options.path
    }

    this.actions[options.action] = {
      requestFn: (params: Object = {}, data: Object = {}, requestHeaders: Object = null) => {

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
          this.axios.defaults.paramsSerializer !== undefined
        if (queryParams || paramsSerializer) {
          requestConfig["params"] = params
        }

        if (headersFn) {
          if (requestConfig["headers"]) {
            Object.assign(requestConfig["headers"], headersFn(params))
          } else {
            requestConfig["headers"] = headersFn(params)
          }
        }

        if (requestHeaders) {
          if (requestConfig["headers"]) {
            Object.assign(requestConfig["headers"], requestHeaders)
          } else {
            requestConfig["headers"] = requestHeaders
          }
        }

        // This is assignment is made to respect the priority of the base URL, url, method and data.
        // It is as following: baseURL > axios instance base URL > request config base URL
        const fullRequestConfig = Object.assign({
          method: options.method as AxiosRequestConfig["method"],
          url: urlFn(params),
          baseURL: this.normalizedBaseURL,
          data: data
        }, requestConfig)
        return this.axios.request(fullRequestConfig)
      },
      property: options.property,
      beforeRequest: options.beforeRequest,
      onSuccess: options.onSuccess,
      onError: options.onError,
      dispatchString: this.getDispatchString(options.action),
      commitString: this.getCommitString(options.action),
      axios: this.axios
    }

    return this
  }

  private getHeadersFn(options: ResourceActionOptions) {
    if (options.headers) {
      if (typeof options.headers === "function") {
        const headersFunction: Function = options.headers
        return (params: Object) => headersFunction(params)
      }
      else {
        return () => options.headers
      }
    }

    return null
  }

  private get normalizedBaseURL(): string {
    return this.baseURL || this.axios.defaults.baseURL || ""
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
