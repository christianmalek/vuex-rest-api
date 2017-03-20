var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class StoreCreator {
    constructor(resource) {
        this.successSuffix = "SUCCEEDED";
        this.failureSuffix = "FAILED";
        this.resource = resource;
        this.store = this.createStore();
    }
    createState() {
        const state = Object.assign({
            pending: false,
            error: null
        }, this.resource.state);
        const actions = this.resource.actions;
        Object.keys(actions).forEach((action) => {
            const { baseName } = actions[action];
            state[baseName] = null;
        });
        return state;
    }
    createMutations() {
        const mutations = {};
        const actions = this.resource.actions;
        Object.keys(actions).forEach((action) => {
            const { baseName, commitString, mutationSuccessFn, mutationFailureFn } = actions[action];
            mutations[`${commitString}`] = (state) => {
                state.pending = true;
                state.error = null;
            };
            mutations[`${commitString}_${this.successSuffix}`] = (state, payload) => {
                state.pending = false;
                state.error = null;
                if (mutationSuccessFn) {
                    mutationSuccessFn(state, payload);
                }
                else {
                    state[baseName] = payload;
                }
            };
            mutations[`${commitString}_${this.failureSuffix}`] = (state, payload) => {
                state.pending = false;
                state.error = payload;
                if (mutationFailureFn) {
                    mutationFailureFn(state, payload);
                }
                else {
                    state[baseName] = null;
                }
            };
        });
        return mutations;
    }
    createActions() {
        const storeActions = {};
        const actions = this.resource.actions;
        Object.keys(actions).forEach((action) => {
            const { dispatchString, commitString, requestFn } = actions[action];
            storeActions[dispatchString] = ({ commit }, params = {}, data = {}) => __awaiter(this, void 0, void 0, function* () {
                commit(commitString);
                return requestFn(params, data)
                    .then((response) => {
                    commit(`${commitString}_${this.successSuffix}`, response);
                    return Promise.resolve(response.body);
                }, (error) => {
                    commit(`${commitString}_${this.failureSuffix}`, error);
                    return Promise.reject(error);
                });
            });
        });
        return storeActions;
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
//# sourceMappingURL=StoreCreator.js.map