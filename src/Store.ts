import Resource from "./Resource"
import axiosStatic, { CancelTokenStatic, AxiosRequestConfig } from "axios"
import * as cloneDeep from "lodash.clonedeep"

export interface Store {
  namespaced: boolean,
  state: object | Function
  mutations: MutationMap
  actions: ActionMap
}

export interface StoreOptions {
  // see "module reuse" under https://vuex.vuejs.org/en/modules.html
  createStateFn?: boolean,
  namespaced?: boolean
}

export interface ActionMap {
  [action: string]: Function
}

export interface MutationMap {
  [action: string]: Function
}

class StoreCreator {
  private static readonly CANCEL_TOKEN_PROVIDER: CancelTokenStatic = axiosStatic.CancelToken
  private static readonly DEFAULT_REQUEST_CONFIG: AxiosRequestConfig = { params: {}, data: {} }

  private resource: Resource
  private options: StoreOptions
  private successSuffix: string = "SUCCEEDED"
  private errorSuffix: string = "FAILED"
  public store: Store

  constructor(resource: Resource, options: StoreOptions) {
    this.resource = resource
    this.resource = resource
    this.options = Object.assign({
      createStateFn: false,
      namespaced: false
    }, options)

    this.store = this.createStore()
  }

  createState(): object | Function {
    if (this.options.createStateFn) {
      return this.createStateFn()
    } else {
      return this.createStateObject()
    }
  }

  private createStateObject(): object {
    const resourceState: object = cloneDeep(this.resource.state)

    const state: object = Object.assign({
      pending: {},
      error: {},
      source: {},
    }, resourceState)

    const actions = this.resource.actions
    Object.keys(actions).forEach((action) => {
      const property = actions[action].property

      // don't do anything if no property is set
      if (property === null) {
        return;
      }

      // if state is undefined set default value to null
      if (state[property] === undefined) {
        state[property] = null
      }

      state["pending"][property] = false
      state["error"][property] = null
      state["source"][property] = null
    })

    return state
  }

  private createStateFn(): Function {
    return (): object => {
      const resourceState: object = cloneDeep(this.resource.state)

      const state: object = Object.assign({
        pending: {},
        error: {},
        source: {},
      }, resourceState)

      const actions = this.resource.actions
      Object.keys(actions).forEach((action) => {
        const property = actions[action].property

        // don't do anything if no property is set
        if (property === null) {
          return;
        }

        // if state is undefined set default value to null
        if (state[property] === undefined) {
          state[property] = null
        }

        state["pending"][property] = false
        state["error"][property] = null
        state["source"][property] = null
      })

      return state
    }
  }

  createGetter(): object {
    return {}
  }

  createMutations(defaultState: object): MutationMap {
    const mutations = {}

    const actions = this.resource.actions
    Object.keys(actions).forEach((action) => {
      const { property, commitString, autoCancel, beforeRequest, onSuccess, onCancel, onError, axios } = actions[action]

      mutations[`${commitString}`] = (state, requestConfig) => {

        if (property !== null) {
          state.pending[property] = true
          state.error[property] = null

          // If autoCancel is enabled and this property maps to a source state, cancel the current pending request.
          if (autoCancel && state.source[property]) {
            state.source[property].cancel()
          }
          // If the request config doesn't contain a cancel token, set one in state for convenience. We'll let the user
          // provided token take precedence here though in case it's needed for a special controlled flow.
          if (!requestConfig.cancelToken) {
            const source = StoreCreator.CANCEL_TOKEN_PROVIDER.source()
            state.source[property] = source
            requestConfig["cancelToken"] = source.token
          }
        }

        if (beforeRequest) {
          beforeRequest(state, requestConfig)
        }
      }
      mutations[`${commitString}_${this.successSuffix}`] = (state, { payload, requestConfig }) => {

        if (property !== null) {
          state.pending[property] = false
          state.error[property] = null
          state.source[property] = null
        }

        if (onSuccess) {
          onSuccess(state, payload, axios, requestConfig)
        } else if (property !== null) {
          state[property] = payload.data
        }
      }
      mutations[`${commitString}_${this.errorSuffix}`] = (state, { payload, requestConfig }) => {

        // Call onCancel if a cancellation error occurs, this can be helpful to let developers differentiate between
        // a normal error path and something separate for cancellation. It will also be called if autoCancel is enabled
        // where onError will not.
        const isCancellationErr = axiosStatic.isCancel(payload)
        if (typeof onCancel === 'function' && isCancellationErr) {
          onCancel(state, payload, axios, requestConfig)
        }

        // The logic here is as follows: if either autoCancel is disabled or the error was not a cancellation error,
        // we'll prevent error handling and clean up. We'll assume that for most cases where autoCancel is useful,
        // we'll want to effectively suspend the lifetime of the pending state until a retry occurs.
        const shouldHandleErr = !autoCancel || !isCancellationErr
        if (!shouldHandleErr) {
          return;
        }

        if (property !== null) {
          state.pending[property] = false
          state.error[property] = payload
          state.source[property] = null
        }

        if (onError) {
          onError(state, payload, axios, requestConfig)
        } else if (property !== null) {
          // sets property to it's default value in case of an error
          state[property] = defaultState[property]
        }
      }
    })

    return mutations
  }

  createActions(): ActionMap {
    const storeActions = {}

    const actions = this.resource.actions
    Object.keys(actions).forEach((action) => {
      const { dispatchString, commitString, requestFn } = actions[action]

      storeActions[dispatchString] = async ({ commit }, requestConfig = cloneDeep(StoreCreator.DEFAULT_REQUEST_CONFIG)) => {
        if (!requestConfig.params)
          requestConfig.params = {}
        if (!requestConfig.data)
          requestConfig.data = {}

        commit(commitString, requestConfig)
        return requestFn(requestConfig)
          .then((response) => {
            commit(`${commitString}_${this.successSuffix}`, {
              payload: response, requestConfig
            })
            return Promise.resolve(response)
          }, (error) => {
            commit(`${commitString}_${this.errorSuffix}`, {
              payload: error, requestConfig
            })
            return Promise.reject(error)
          })
      }
    })

    return storeActions
  }

  createStore(): Store {
    const state = this.createState()

    return {
      namespaced: this.options.namespaced,
      state,
      mutations: this.createMutations(state),
      actions: this.createActions()
    }
  }
}

export function createStore(resource: Resource, options: StoreOptions): Store {
  return new StoreCreator(resource, options).store
}
