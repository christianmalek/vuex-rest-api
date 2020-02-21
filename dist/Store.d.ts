import Resource from "./Resource";
export interface Store {
    namespaced: boolean;
    state: object | Function;
    mutations: MutationMap;
    actions: ActionMap;
}
export interface StoreOptions {
    createStateFn?: boolean;
    namespaced?: boolean;
}
export interface ActionMap {
    [action: string]: Function;
}
export interface MutationMap {
    [action: string]: Function;
}
export declare function createStore(resource: Resource, options: StoreOptions): Store;
