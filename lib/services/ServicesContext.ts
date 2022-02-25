import { Service, SERVICE_SETUP_CONTEXT_ACCESSOR } from './Service';

/**
 * Not found service error
 */
export class ServiceNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        // restore prototype chain
        const actualProto = new.target.prototype;

        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        } else {
            (this as any).__proto__ = actualProto;
        }
    }
}

/**
 * Services context
 */
export class ServicesContext {
    constructor(
        protected services: Array<Service>,
    ) {
        this.services.forEach(service => service[SERVICE_SETUP_CONTEXT_ACCESSOR](this));
        this.services.forEach(service => service.resolve());
    }

    public lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)) {
        const found = typeof dependency === 'string' ?
            this.services.find(i => i.constructor.name === dependency) :
            this.services.find(i => i instanceof dependency);

        if (!found) {
            throw new ServiceNotFoundError(`Context does not contains instance of ${typeof dependency === 'string' ? dependency : dependency.name}.`);
        }
        return found as T;
    }
}
