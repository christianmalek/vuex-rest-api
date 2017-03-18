import axios from "axios";

class Vrap {

  constructor(actions) {
    this.actions = actions;
    this.successSuffix = "_SUCCEEDED";
    this.failureSuffix = "_FAILED";
    this.store = this.createStore();
  }

  createState() {
    const state = {};
    state.pending = false;
    state.error = null;

    const keys = Object.keys(this.actions);
    if (keys.length > 0) {
      const name = this.actions[keys[0]].name;
      state[name] = null;
    }

    return state;
  }

  createMutations() {
    const mutations = {};

    Object.keys(this.actions).forEach((action) => {
      const { name, capitalizedName,
        mutationSuccessFn, mutationFailureFn
      } = this.actions[action];

      mutations[`${action}_${capitalizedName}`] = (state) => {
        state.pending = true;
        state.error = null;
      };
      mutations[`${action}_${capitalizedName}_${this.successSuffix}`] = (state, payload) => {
        state.pending = false;
        state.error = null;

        if (mutationSuccessFn !== null) {
          mutationSuccessFn(state, payload);
        } else {
          state[name] = payload;
        }
      };
      mutations[`${action}_${capitalizedName}_${this.failureSuffix}`] = (state, payload) => {
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

  createActions() {
    const actions = {};

    Object.keys(this.actions).forEach((action) => {
      const { name, capitalizedName, requestFn } = this.actions[action];

      actions[`${action}_${name}`] = ({ commit }, { params = {}, body = {} } = {}) => {
        commit(`${action}_${capitalizedName}`);
        requestFn(params, body)
          .then((response) => {
            commit(`${action}_${capitalizedName}_${this.successSuffix}`, response);
          }, (error) => {
            commit(`${action}_${capitalizedName}_${this.failureSuffix}`, error);
          });
      };
    });

    return actions;
  }

  createStore() {
    return {
      state: this.createState(),
      mutations: this.createMutations(),
      actions: this.createActions()
    };
  }
}

export class Resource {
  constructor(name, baseURL, pathFn) {
    this.name = name;
    this.baseURL = baseURL;
    this.pathFn = pathFn;
    this.actions = {};
  }

  addAction({ action, method, pathFn = null, mutationSuccessFn = null, mutationFailureFn = null }) {
    const completePathFn = (params = {}) =>
      this.baseURL + (pathFn === null ? this.pathFn(params) : pathFn(params));

    this.actions[action] = {
      requestFn: (params = {}) => axios[method](completePathFn(params)),
      mutationSuccessFn,
      mutationFailureFn,
      name: this.name,
      capitalizedName: this.name.replace(/([A-Z])/g, "_$1")
    };

    return this;
  }
}

export default function createStore(actions) {
  return (new Vrap(actions)).store;
}
