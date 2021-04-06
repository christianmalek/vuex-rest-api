import { AxiosInstance } from "axios";
export interface ResourceAction {
    requestFn: Function;
    autoCancel: Boolean;
    beforeRequest: Function;
    onSuccess: Function;
    onCancel: Function;
    onError: Function;
    property: string;
    dispatchString: string;
    commitString: string;
    axios: AxiosInstance;
}
export interface ResourceActionMap {
    [action: string]: ResourceAction;
}
export interface ShorthandResourceActionOptions {
    action: string;
    property?: string;
    path: Function | string;
    autoCancel?: Boolean;
    beforeRequest?: Function;
    onSuccess?: Function;
    onCancel?: Function;
    onError?: Function;
    requestConfig?: Object;
    queryParams?: Boolean;
    headers?: Function | Object;
}
export interface ResourceActionOptions extends ShorthandResourceActionOptions {
    method: string;
}
export interface ResourceOptions {
    baseURL?: string;
    state?: Object;
    axios?: AxiosInstance;
    queryParams?: Boolean;
}
export declare class Resource {
    private baseURL;
    private readonly HTTPMethod;
    actions: ResourceActionMap;
    state: Object;
    axios: AxiosInstance;
    private queryParams;
    constructor(options: ResourceOptions);
    add(options: ResourceActionOptions): Resource;
    private getHeadersFn;
    private get normalizedBaseURL();
    private getDispatchString;
    private getCommitString;
}
export default Resource;
