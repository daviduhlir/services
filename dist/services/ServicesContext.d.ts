import { Service } from './Service';
export declare type ServiceDependecyConstructor = new (context: ServicesContext) => Service;
export declare type LookupDescriptor<T extends Service = Service> = string | (new (context: ServicesContext) => T);
export declare class ServicesContext {
    static inject: (dependency: string | ServiceDependecyConstructor, optional?: boolean) => (target: any, memberName: string) => void;
    static injectContext: () => (target: any, memberName: string) => void;
    static initialize(services: Array<Service>): void;
    static waitForInit(): Promise<Service[]>;
    static lookup<T extends Service>(dependency: LookupDescriptor<T>): T;
    static getAllServices(): {
        [name: string]: Service;
    };
    static addServices(services: Array<Service>): void;
    protected static instance: ServicesContext;
    protected services: Array<Service>;
    protected constructor(services: Array<Service>);
    protected waitForInit(): Promise<Service[]>;
    protected lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)): T;
    protected getAllServices(): {
        [name: string]: Service;
    };
    protected addServices(services: Array<Service>): void;
    protected initializeServices(services: Array<Service>): Promise<void>;
}
