/**
 * Not found service error
 */
export class ServiceNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    // restore prototype chain
    const actualProto = new.target.prototype

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto)
    } else {
      ;(this as any).__proto__ = actualProto
    }
  }
}
