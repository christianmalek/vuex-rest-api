import Resource from "./Resource";
class StoreCreator {
    constructor(resource) {
        this.successSuffix = "SUCCEEDED";
        this.failureSuffix = "FAILED";
        this.actions = resource.actions;
        this.store = this.createStore();
    }
    createState() {
        const state = {};
        state["pending"] = false;
        state["error"] = null;
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
                }
                else {
                    state[name] = payload;
                }
            };
            mutations[`${commitString}_${this.failureSuffix}`] = (state, payload) => {
                state.pending = false;
                state.error = payload;
                if (mutationFailureFn !== null) {
                    mutationFailureFn(state, payload);
                }
                else {
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
export function createStore(actions) {
    return (new StoreCreator(actions)).store;
}
const Vrap = {
    createStore,
    Resource
};
export default Vrap;
//# sourceMappingURL=Vrap.js.map