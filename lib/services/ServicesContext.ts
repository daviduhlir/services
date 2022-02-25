import { Service, SERVICE_SETUP_CONTEXT_ACCESSOR } from './Service';
import { ServiceNotFoundError } from '../utils/errors';
import { EventEmitter } from 'events';

/**
 * Services context
 */
export class ServicesContext {
    protected internalEmitter: EventEmitter = new EventEmitter();
    protected initDone: boolean = false;
    /**
     * Init with all services
     * @param services
     */
    constructor(
        protected services: Array<Service>,
    ) {
        this.services.forEach(service => service[SERVICE_SETUP_CONTEXT_ACCESSOR](this));
        this.services.forEach(service => service.resolve());
        this.initializeServices();
    }

    /**
     * Internal services initializations
     */
    protected async initializeServices() {
        await Promise.all(this.services.map(i => i.initialize()));
        this.initDone = true;
        this.internalEmitter.emit('done');
    }

    /**
     * Method, that will wait until init of services is completed.
     */
    public async waitForInit() {
        return new Promise((resolve) => {
            if (this.initDone) {
                resolve(0);
            }
            this.internalEmitter.once('done', resolve)
        });
    }

    /**
     * Lookup for dependency. You can use string name instead of constructor.
     * @param dependency
     * @returns
     */
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
