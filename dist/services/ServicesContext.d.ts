import { Service } from './Service';
export declare type ServiceDependecyConstructor = new (context: ServicesContext) => Service;
export declare class ServicesContext {
    protected services: Array<Service>;
    static inject: (dependency: string | ServiceDependecyConstructor, optional?: boolean) => (target: any, memberName: string) => void;
    static injectContext: () => (target: any, memberName: string) => void;
    static initialize(services: Array<Service>): void;
    static waitForInit(): Promise<unknown[]>;
    static lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)): T;
    static getAllServices(): {
        [name: string]: Service;
    };
    protected static instance: ServicesContext;
    protected constructor(services: Array<Service>);
    protected waitForInit(): Promise<unknown[]>;
    protected lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)): T;
    protected getAllServices(): {
        [name: string]: Service;
    };
    protected initializeServices(): Promise<void>;
}
