var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Resource from "./Resource";
export { Resource };
class StoreCreator {
    constructor(actions) {
        this.successSuffix = "SUCCEEDED";
        this.failureSuffix = "FAILED";
        this.actions = actions;
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
            actions[dispatchString] = ({ commit }, { params = {}, body = {} } = {}) => __awaiter(this, void 0, void 0, function* () {
                commit(commitString);
                return requestFn(params, body)
                    .then((response) => {
                    commit(`${commitString}_${this.successSuffix}`, response);
                    return Promise.resolve(response.body);
                }, (error) => {
                    commit(`${commitString}_${this.failureSuffix}`, error);
                    return Promise.reject(error);
                });
            });
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
//# sourceMappingURL=StoreCreator.js.map