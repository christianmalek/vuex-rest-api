export interface ResourceAction {
    requestFn: Function;
    mutationSuccessFn: Function;
    mutationFailureFn: Function;
    property: string;
    dispatchString: string;
    commitString: string;
}
export interface ResourceActionMap {
    [action: string]: ResourceAction;
}
export interface ResourceActionOptions {
    action: string;
    property: string;
    method: string;
    pathFn: Function;
    mutationSuccessFn?: Function;
    mutationFailureFn?: Function;
    requestConfig?: Object;
    queryParams?: Boolean;
}
export interface ResourceOptions {
    state?: Object;
    axios?: Object;
    queryParams?: Boolean;
}
export default class Resource {
    private baseURL;
    private readonly HTTPMethod;
    actions: ResourceActionMap;
    state: Object;
    private axios;
    private queryParams;
    constructor(baseURL: string, options?: ResourceOptions);
    addAction(options: ResourceActionOptions): Resource;
    private getDispatchString(action);
    private getCommitString(action);
}
