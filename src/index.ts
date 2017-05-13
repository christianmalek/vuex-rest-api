import { createStore, Store } from "./Store"
import { Resource, ResourceActionOptions, ResourceOptions } from "./Resource"

export class Vrex {
    private resource: Resource

    constructor(options: ResourceOptions) {
        this.resource = new Resource(options)
        return this
    }

    get(options: ResourceActionOptions) {
        return this.add(Object.assign(options, { method: "get" }))
    }

    delete(options: ResourceActionOptions) {
        return this.add(Object.assign(options, { method: "delete" }))
    }

    post(options: ResourceActionOptions) {
        return this.add(Object.assign(options, { method: "post" }))
    }

    put(options: ResourceActionOptions) {
        return this.add(Object.assign(options, { method: "put" }))
    }

    patch(options: ResourceActionOptions) {
        return this.add(Object.assign(options, { method: "patch" }))
    }

    add(options: ResourceActionOptions): Vrex {
        this.resource.add(options)
        return this
    }

    getStore(): Store {
        return createStore(this.resource)
    }
}

export default Vrex