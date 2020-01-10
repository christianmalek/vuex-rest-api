import Resource from "./Resource";
export interface Store {
    namespaced: Boolean;
    state: Object | Function;
    mutations: MutationMap;
    actions: ActionMap;
}
export interface StoreOptions {
    createStateFn?: Boolean;
    namespaced?: Boolean;
}
export interface ActionMap {
    [action: string]: Function;
}
export interface MutationMap {
    [action: string]: Function;
}
export declare function createStore(resource: Resource, options: StoreOptions): Store;
