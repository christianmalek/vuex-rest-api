import { createStore, Store, StoreOptions } from "./Store"
import { Resource, ShorthandResourceActionOptions, ResourceActionOptions, ResourceOptions } from "./Resource"

export class Vapi {
  private resource: Resource

  constructor(options: ResourceOptions) {
    this.resource = new Resource(options)
    return this
  }

  get(options: ShorthandResourceActionOptions) {
    return this.add(Object.assign(options, { method: "get" }))
  }

  delete(options: ShorthandResourceActionOptions) {
    return this.add(Object.assign(options, { method: "delete" }))
  }

  head(options: ShorthandResourceActionOptions) {
    return this.add(Object.assign(options, { method: "head" }))
  }

  options(options: ShorthandResourceActionOptions) {
    return this.add(Object.assign(options, { method: "options" }))
  }

  post(options: ShorthandResourceActionOptions) {
    return this.add(Object.assign(options, { method: "post" }))
  }

  put(options: ShorthandResourceActionOptions) {
    return this.add(Object.assign(options, { method: "put" }))
  }

  patch(options: ShorthandResourceActionOptions) {
    return this.add(Object.assign(options, { method: "patch" }))
  }

  add(options: ResourceActionOptions): Vapi {
    this.resource.add(options)
    return this
  }

  getStore(options: StoreOptions = {}): Store {
    return createStore(this.resource, options)
  }
}

export default Vapi