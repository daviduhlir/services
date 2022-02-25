import { ServicesContext } from './ServicesContext';

export const SERVICE_SETUP_CONTEXT_ACCESSOR = Symbol();

/**
 * Base service class
 */
export class BaseService {
    private preparedInjections;
    private context: ServicesContext;

    //private accessor to setup context
    [SERVICE_SETUP_CONTEXT_ACCESSOR] = (context: ServicesContext) => this.context = context;

    public resolve() {
        if (this.preparedInjections) {
            for(const injection of this.preparedInjections) {
                this[injection[0]] = this.context.lookup(injection[1]);
            }
        }
    }

    protected static inject = (dependency: new (context: ServicesContext) => BaseService) => {
        return (target: any, memberName: string) => {
            target.preparedInjections = [...(target.preparedInjections ? target.preparedInjections : []), [memberName, dependency]];
        };
    }
}
