import { Store, StoreOptions } from "./Store";
import { ShorthandResourceActionOptions, ResourceActionOptions, ResourceOptions } from "./Resource";
export declare class Vapi {
    private resource;
    constructor(options: ResourceOptions);
    get(options: ShorthandResourceActionOptions): Vapi;
    delete(options: ShorthandResourceActionOptions): Vapi;
    head(options: ShorthandResourceActionOptions): Vapi;
    options(options: ShorthandResourceActionOptions): Vapi;
    post(options: ShorthandResourceActionOptions): Vapi;
    put(options: ShorthandResourceActionOptions): Vapi;
    patch(options: ShorthandResourceActionOptions): Vapi;
    add(options: ResourceActionOptions): Vapi;
    getStore(options?: StoreOptions): Store;
}
export default Vapi;
