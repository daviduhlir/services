import { Service, SERVICE_SETUP_CONTEXT_ACCESSOR } from './Service';
import { ServiceNotFoundError } from '../utils/errors';

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
