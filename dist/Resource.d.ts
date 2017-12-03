export interface ResourceAction {
    requestFn: Function;
    onSuccess: Function;
    onError: Function;
    property: string;
    dispatchString: string;
    commitString: string;
}
export interface ResourceActionMap {
    [action: string]: ResourceAction;
}
export interface ShorthandResourceActionOptions {
    action: string;
    property?: string;
    path: Function | string;
    onSuccess?: Function;
    onError?: Function;
    requestConfig?: Object;
    queryParams?: Boolean;
}
export interface ResourceActionOptions extends ShorthandResourceActionOptions {
    method: string;
}
export interface ResourceOptions {
    baseURL?: string;
    state?: Object;
    axios?: Object;
    queryParams?: Boolean;
}
export declare class Resource {
    private baseURL;
    private readonly HTTPMethod;
    actions: ResourceActionMap;
    state: Object;
    private axios;
    private queryParams;
    constructor(options: ResourceOptions);
    add(options: ResourceActionOptions): Resource;
    private readonly normalizedBaseURL;
    private getDispatchString(action);
    private getCommitString(action);
}
export default Resource;
