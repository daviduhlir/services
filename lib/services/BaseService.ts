import { ContextServices, ServicesContext } from './ServicesContext';
import { AsUniqueArray } from '../utils/typings';


/**
 * Base service class
 */
export class BaseService<
    TConfig extends Object = {},
    TDependencies extends ContextServices = {},
> {
    private servicesContext: ServicesContext;
    private injectedDependecies: TDependencies = {} as TDependencies;
    private dependeciesProxy: any;

    constructor(
        public readonly config: TConfig = {} as TConfig,
    ) {
        this.dependeciesProxy = new Proxy({}, {
            get: (target, name: string) => {
                if (!this.injectedDependecies[name]) {
                    throw new Error(`Trying to get not injected dependecy ${name}. Use inject method before.`)
                }
                return this.injectedDependecies[name];
            },
        });
    }

    /**
     * Get context
     */
    public get context(): TDependencies {
        return this.dependeciesProxy;
    }

    /**
     * Initialize will be called after context creation
     */
    public async initialize() {}

    /**
     * Everything was initialized
     */
    public async onMounted() {}

    /**
     * Inject dependecies to be used in our service
     * @param dependecies
     */
    protected async inject<
        TDependenciesArray extends [] | ReadonlyArray<keyof TDependencies> & AsUniqueArray<TDependenciesArray, TDependenciesArray>
    >(dependecies: TDependenciesArray) {
        if (!this.servicesContext) {
            throw new Error(`Trying to inject dependecies before services initialization. Use initialize method to inject dependencies.`);
        }

        const names = dependecies as string[];
        for(const name of names) {
            if (!this.servicesContext.services[name]) {
                throw new Error(`Dependecy ${name} of service was not found in context.`);
            }
            (this.injectedDependecies as any)[name] = this.servicesContext.services[name];
        }
    }

    /**
     * Inject dependecies from context
     * @param context
     */
    public _internalAssignContext(context: ServicesContext<TDependencies>) {
        this.servicesContext = context
    }
}
