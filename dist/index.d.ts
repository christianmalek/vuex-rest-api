import { Store } from "./Store";
import { ResourceActionOptions, ResourceOptions } from "./Resource";
export declare class Vapi {
    private resource;
    constructor(options: ResourceOptions);
    get(options: ResourceActionOptions): Vapi;
    delete(options: ResourceActionOptions): Vapi;
    post(options: ResourceActionOptions): Vapi;
    put(options: ResourceActionOptions): Vapi;
    patch(options: ResourceActionOptions): Vapi;
    add(options: ResourceActionOptions): Vapi;
    getStore(): Store;
}
export default Vapi;
