import Resource, { ResourceActionMap } from "./Resource";

interface Store {
  state: Object;
  mutations: MutationMap;
  actions: ActionMap;
}

interface ActionMap {
  [action: string]: Function
}

interface MutationMap {
  [action: string]: Function
}

class StoreCreator {
  private resource: Resource;
  private successSuffix: string = "SUCCEEDED";
  private failureSuffix: string = "FAILED";
  public store: Store;

  constructor(resource: Resource) {
    this.resource = resource;
    this.store = this.createStore();
  }

  createState(): Object {
    const state: Object = Object.assign({
      pending: false,
      error: null
    }, this.resource.state);

    const actions = this.resource.actions;
    Object.keys(actions).forEach((action) => {
      const { baseName, name } = actions[action];

      if (state[baseName] === undefined) {
        state[baseName] = null;
      }

      if (name && state[name] === undefined) {
        state[name] = null;
      }
    });

    return state;
  }

  createMutations(): MutationMap {
    const mutations = {};

    const actions = this.resource.actions;
    Object.keys(actions).forEach((action) => {
      const { name, commitString, mutationSuccessFn, mutationFailureFn } = actions[action];

      mutations[`${commitString}`] = (state) => {
        state.pending = true;
        state.error = null;
      };
      mutations[`${commitString}_${this.successSuffix}`] = (state, payload) => {
        state.pending = false;
        state.error = null;

        if (mutationSuccessFn !== null) {
          mutationSuccessFn(state, payload);
        } else {
          state[name] = payload;
        }
      };
      mutations[`${commitString}_${this.failureSuffix}`] = (state, payload) => {
        state.pending = false;
        state.error = payload;

        if (mutationFailureFn !== null) {
          mutationFailureFn(state, payload);
        } else {
          state[name] = null;
        }
      };
    });

    return mutations;
  }

  createActions(): ActionMap {
    const storeActions = {};

    const actions = this.resource.actions;
    Object.keys(actions).forEach((action) => {
      const { dispatchString, commitString, pathFn } = actions[action];

      storeActions[dispatchString] = async ({ commit }, { params = {}, body = {} } = {}) => {
        commit(commitString);
        return pathFn(params, body)
          .then((response) => {
            commit(`${commitString}_${this.successSuffix}`, response);
            return Promise.resolve(response.body);
          }, (error) => {
            commit(`${commitString}_${this.failureSuffix}`, error);
            return Promise.reject(error)
          });
      };
    });

    return storeActions;
  }

  createStore(): Store {
    return {
      state: this.createState(),
      mutations: this.createMutations(),
      actions: this.createActions()
    };
  }
}

export function createStore(actions) {
  return (new StoreCreator(actions)).store;
}
