import axios from "axios";

class Vrap {

  constructor(actions) {
    this.actions = actions;
    this.successSuffix = "SUCCEEDED";
    this.failureSuffix = "FAILED";
    this.store = this.createStore();
  }

  createState() {
    const state = {};
    state.pending = false;
    state.error = null;

    Object.keys(this.actions).forEach((action) => {
      const { baseName, name } = this.actions[action];

      if (state[baseName] === undefined) {
        state[baseName] = null;
      }

      if (name && state[name] === undefined) {
        state[name] = null;
      }
    });

    return state;
  }

  createMutations() {
    const mutations = {};

    Object.keys(this.actions).forEach((action) => {
      const { name, commitString, mutationSuccessFn, mutationFailureFn } = this.actions[action];

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

  createActions() {
    const actions = {};

    Object.keys(this.actions).forEach((action) => {
      const { dispatchString, commitString, requestFn } = this.actions[action];

      actions[dispatchString] = ({ commit }, { params = {}, body = {} } = {}) => {
        commit(commitString);
        requestFn(params, body)
          .then((response) => {
            commit(`${commitString}_${this.successSuffix}`, response);
          }, (error) => {
            commit(`${commitString}_${this.failureSuffix}`, error);
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
  constructor(baseName, baseURL, pathFn) {
    this.baseName = baseName;
    this.baseURL = baseURL;
    this.pathFn = pathFn;
    this.actions = {};
  }

  addAction({ action, method, pathFn = null, name = "",
    mutationSuccessFn = null, mutationFailureFn = null }) {
    const completePathFn = params =>
      this.baseURL + (pathFn === null ? this.pathFn(params) : pathFn(params));
    this.actions[action] = {
      requestFn: (params = {}) => {
        console.log("params: ", params);
        return axios[method](completePathFn(params));
      },
      mutationSuccessFn,
      mutationFailureFn,
      baseName: this.baseName,
      name,
      dispatchString: this.getDispatchString(action, this.baseName, name),
      commitString: this.getCommitString(action, this.baseName, name)
    };

    return this;
  }

  getDispatchString(action, baseName, name) {
    let actionName = "";
    if (name) {
      actionName = name[0].toUpperCase() + name.substring(1);
    } else {
      actionName = baseName[0].toUpperCase() + baseName.substring(1);
    }

    return `${action}${actionName}`;
  }

  getCommitString(action, baseName, name) {
    const mutationName = (name || baseName).replace(/([A-Z])/g, "_$1").toUpperCase();
    const capitalizedAction = action.toUpperCase();

    return `${capitalizedAction}_${mutationName}`;
  }
}

export default function createStore(actions) {
  return (new Vrap(actions)).store;
}
