import { BaseService, SERVICE_SETUP_CONTEXT_ACCESSOR } from './BaseService';

export class ServicesContext {
    constructor(
        protected services: Array<BaseService>,
    ) {
        this.services.forEach(service => service[SERVICE_SETUP_CONTEXT_ACCESSOR](this));
        this.services.forEach(service => service.resolve());
    }

    public lookup<T extends BaseService>(dependency: new (context: ServicesContext) => T) {
        const found = this.services.find(i => i instanceof dependency);
        if (!found) {
            throw new Error(`Context does not contains instance of requested service to be injected`);
        }
        return found as T;
    }
}
