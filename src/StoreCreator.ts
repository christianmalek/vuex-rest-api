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

interface ActionParamsBody {
  params: Object;
  data: Object;
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
      pending: {},
      error: {}
    }, this.resource.state);

    const actions = this.resource.actions;
    Object.keys(actions).forEach((action) => {
      const property = actions[action].property;
      state[property] = null;
      state["pending"][property] = false;
      state["error"][property] = null;
    });

    return state;
  }

  createGetter(): Object {
    return {};
  }

  createMutations(): MutationMap {
    const mutations = {};

    const actions = this.resource.actions;
    Object.keys(actions).forEach((action) => {
      const { property, commitString, mutationSuccessFn, mutationFailureFn } = actions[action];

      mutations[`${commitString}`] = (state) => {
        state.pending[property] = true;
        state.error[property] = null;
      };
      mutations[`${commitString}_${this.successSuffix}`] = (state, payload) => {
        state.pending[property] = false;
        state.error[property] = null;

        if (mutationSuccessFn) {
          mutationSuccessFn(state, payload);
        } else {
          state[property] = payload.data;
        }
      };
      mutations[`${commitString}_${this.failureSuffix}`] = (state, payload) => {
        state.pending[property] = false;
        state.error[property] = payload;

        if (mutationFailureFn) {
          mutationFailureFn(state, payload);
        } else {
          state[property] = null;
        }
      };
    });

    return mutations;
  }

  createActions(): ActionMap {
    const storeActions = {};

    const actions = this.resource.actions;
    Object.keys(actions).forEach((action) => {
      const { dispatchString, commitString, requestFn } = actions[action];

      storeActions[dispatchString] = async ({ commit }, { params = {}, data = {} }: ActionParamsBody) => {
        commit(commitString);
        return requestFn(params, data)
          .then((response) => {
            commit(`${commitString}_${this.successSuffix}`, response);
            return Promise.resolve(response);
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

export function createStore(resource: Resource): Store {
  return new StoreCreator(resource).store;
}
