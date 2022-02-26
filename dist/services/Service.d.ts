import { ServicesContext } from './ServicesContext';
export declare type ServiceDependecyConstructor = new (context: ServicesContext) => Service;
export declare const SERVICE_SETUP_CONTEXT_ACCESSOR: unique symbol;
export declare class Service {
    protected static inject: (dependency: string | ServiceDependecyConstructor, optional?: boolean) => (target: any, memberName: string) => void;
    resolve(): void;
    initialize(): Promise<void>;
    private preparedInjections;
    private context;
    [SERVICE_SETUP_CONTEXT_ACCESSOR]: (context: ServicesContext) => ServicesContext;
}
