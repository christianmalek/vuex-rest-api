import { Store } from "./Store";
import { ResourceActionOptions, ResourceOptions } from "./Resource";
export declare class Vrex {
    private resource;
    constructor(options: ResourceOptions);
    get(options: ResourceActionOptions): Vrex;
    delete(options: ResourceActionOptions): Vrex;
    post(options: ResourceActionOptions): Vrex;
    put(options: ResourceActionOptions): Vrex;
    patch(options: ResourceActionOptions): Vrex;
    add(options: ResourceActionOptions): Vrex;
    getStore(): Store;
}
export default Vrex;
