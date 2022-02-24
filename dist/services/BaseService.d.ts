import { ContextServices, ServicesContext } from './ServicesContext';
import { AsUniqueArray } from '../utils/typings';
export declare class BaseService<TConfig extends Object = {}, TDependencies extends ContextServices = {}> {
    readonly config: TConfig;
    private servicesContext;
    private injectedDependecies;
    private dependeciesProxy;
    constructor(config?: TConfig);
    get context(): TDependencies;
    initialize(): Promise<void>;
    protected inject<TDependenciesArray extends [] | (ReadonlyArray<keyof TDependencies> & AsUniqueArray<TDependenciesArray, TDependenciesArray>)>(dependecies: TDependenciesArray): Promise<void>;
    _internalAssignContext(context: ServicesContext<TDependencies>): void;
}
