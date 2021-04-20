import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

export interface ResourceAction {
  requestFn: Function,
  autoCancel: Boolean,
  beforeRequest: Function,
  onSuccess: Function,
  onCancel: Function,
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
  autoCancel?: Boolean
  beforeRequest?: Function
  onSuccess?: Function
  onCancel?: Function
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
  queryParams?: Boolean,
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
      requestFn: (requestConfig) => {
        const tmpRequestConfig = Object.assign({}, requestConfig, options.requestConfig)

        const { params } = tmpRequestConfig;
        if (headersFn) {
          if (tmpRequestConfig["headers"]) {
            Object.assign(tmpRequestConfig["headers"], headersFn(params))
          } else {
            tmpRequestConfig["headers"] = headersFn(params)
          }
        }

        let queryParams
        // use action specific queryParams if set
        if (options.queryParams !== undefined) {
          queryParams = options.queryParams
          // otherwise use Resource-wide queryParams
        } else {
          queryParams = this.queryParams
        }

        // If the queryParams config is disabled omit params in fullRequestConfig. This is to keep changes around
        // passing in a complete AxiosRequestConfig backwards compatible with previous versions of the library where
        // the ActionParams partial was used.
        if (!queryParams) {
          tmpRequestConfig["params"] = {};
        }

        // This assignment is made to respect the priority of the base URL, url, method.
        // It is as following: baseURL > axios instance base URL > request config base URL
        const method = options.method as AxiosRequestConfig["method"]
        const fullRequestConfig = Object.assign({
          method,
          url: urlFn(params),
          baseURL: this.normalizedBaseURL,
        }, tmpRequestConfig)

        // In v2.13.0 a regression was introduced that was allowing data to be passed along with GET requests,
        // this has the unintended side effect of setting content-type: application/json;charset=UTF-8 headers and
        // is an unwanted side effect. This is the least intrusive way of handling this problem for now, but I don't
        // think we really even need a default data prop in this flow.
        if (["post", "put", "patch"].indexOf(method.toLowerCase()) === -1) {
          delete fullRequestConfig.data;
        }
        return this.axios.request(fullRequestConfig)
      },
      property: options.property,
      autoCancel: options.autoCancel,
      beforeRequest: options.beforeRequest,
      onSuccess: options.onSuccess,
      onCancel: options.onCancel,
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
