import Resource from "./Resource";
export interface Store {
    state: Object;
    mutations: MutationMap;
    actions: ActionMap;
}
export interface ActionMap {
    [action: string]: Function;
}
export interface MutationMap {
    [action: string]: Function;
}
export declare function createStore(resource: Resource): Store;
