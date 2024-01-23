import Resource, { ResourceActionMap } from "./Resource"
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

interface ActionParamsBody {
  params: object
  data: object,
  requestHeaders: object
}

class StoreCreator {
  private resource: Resource
  private options: StoreOptions
  private successSuffix: string = "SUCCEEDED"
  private errorSuffix: string = "FAILED"
  public store: Store

  constructor(resource: Resource, options: StoreOptions) {
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
      error: {}
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
    })

    return state
  }

  private createStateFn(): Function {
    return (): object => {
      const resourceState: object = cloneDeep(this.resource.state)

      const state: object = Object.assign({
        pending: {},
        error: {}
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
      const { property, commitString, beforeRequest, onSuccess, onError, axios } = actions[action]

      mutations[`${commitString}`] = (state, actionParams) => {

        if (property !== null) {
          state.pending[property] = true
          state.error[property] = null
        }

        if (beforeRequest) {
          beforeRequest(state, actionParams)
        }
      }
      mutations[`${commitString}_${this.successSuffix}`] = (state, { payload, actionParams }) => {

        if (property !== null) {
          state.pending[property] = false
          state.error[property] = null
        }

        if (onSuccess) {
          onSuccess(state, payload, axios, actionParams)
        } else if (property !== null) {
          state[property] = payload.data
        }
      }
      mutations[`${commitString}_${this.errorSuffix}`] = (state, { payload, actionParams }) => {

        if (property !== null) {
          state.pending[property] = false
          state.error[property] = payload
        }

        if (onError) {
          onError(state, payload, axios, actionParams)
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

      storeActions[dispatchString] = async ({ commit }, actionParams: ActionParamsBody = { params: {}, data: {}, requestHeaders: null }) => {
        if (!actionParams.params)
          actionParams.params = {}
        if (!actionParams.data)
          actionParams.data = {}

        commit(commitString, actionParams)
        return requestFn(actionParams.params, actionParams.data, actionParams.requestHeaders)
          .then((response) => {
            commit(`${commitString}_${this.successSuffix}`, {
              payload: response, actionParams
            })
            return Promise.resolve(response)
          }, (error) => {
            commit(`${commitString}_${this.errorSuffix}`, {
              payload: error, actionParams
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
