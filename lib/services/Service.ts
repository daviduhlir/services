import { ServiceNotFoundError } from '../utils/errors';
import { ServicesContext } from './ServicesContext';

export type ServiceDependecyConstructor = new (context: ServicesContext) => Service

export const SERVICE_SETUP_CONTEXT_ACCESSOR = Symbol();

/**
 * Base service class
 */
export class Service {
    private preparedInjections: {
        memberName: string,
        dependency: string | ServiceDependecyConstructor,
        optional?: boolean
    }[];
    private context: ServicesContext;

    //private accessor to setup context
    [SERVICE_SETUP_CONTEXT_ACCESSOR] = (context: ServicesContext) => this.context = context;

    /**
     * Resolve all injections
     */
    public resolve() {
        if (this.preparedInjections) {
            for(const injection of this.preparedInjections) {
                try {
                    this[injection.memberName] = this.context.lookup(injection.dependency);
                } catch(e) {
                    if (!injection.optional && e instanceof ServiceNotFoundError) {
                        throw e;
                    }
                    this[injection.memberName] = null;
                }
            }
        }
    }

    /**
     * Initialize method, to be overrided with your service init.
     */
    public async initialize() {}

    /**
     * Inject service decorator, this will fill in property with service reference if found
     * @param dependency dependecy constructor
     * @param optional will ignore errors, if service will not be found in context
     * @returns
     */
    protected static inject = (dependency: string | ServiceDependecyConstructor, optional?: boolean) => {
        return (target: any, memberName: string) => {
            target.preparedInjections = [...(target.preparedInjections ? target.preparedInjections : []), {memberName, dependency, optional}];
        };
    }
}
