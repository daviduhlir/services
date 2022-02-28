import { Service, SERVICE_SETUP_CONTEXT_ACCESSOR } from './Service';
import { ServiceNotFoundError } from '../utils/errors';
import { EventEmitter } from 'events';

/**
 * Services context
 */
export class ServicesContext<TServices extends Array<Service>> {
    /**
     * Init with all services
     * @param services
     */
    constructor(
        protected services: TServices,
    ) {
        this.services.forEach(service => service[SERVICE_SETUP_CONTEXT_ACCESSOR](this));
        this.services.forEach(service => service.resolve());
        this.initializeServices();
    }

    /**********************************
     *
     * Public methods
     *
     **********************************/

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
    public lookup<T extends Service>(dependency: string | (new (context: ServicesContext<TServices>) => T)) {
        const found = typeof dependency === 'string' ?
            this.services.find(i => i.constructor.name === dependency) :
            this.services.find(i => i instanceof dependency);

        if (!found) {
            throw new ServiceNotFoundError(`Context does not contains instance of ${typeof dependency === 'string' ? dependency : dependency.name}.`);
        }
        return found as T;
    }

    /**
     * Get all services as object
     * @returns
     */
    public getAllServices(): {[name: string]: Service} {
        return this.services.reduce((acc, i) => ({
            ...acc,
            [i.constructor.name]: i,
        }), {});
    }

    /**********************************
     *
     * Internal methods
     *
     **********************************/
    protected internalEmitter: EventEmitter = new EventEmitter();
    protected initDone: boolean = false;

    /**
     * Internal services initializations
     */
    protected async initializeServices() {
        await Promise.all(this.services.map(i => i.initialize()));
        this.initDone = true;
        this.internalEmitter.emit('done');
    }
}
