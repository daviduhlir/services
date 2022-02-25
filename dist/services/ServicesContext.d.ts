import { Service } from './Service';
export declare class ServicesContext {
    protected services: Array<Service>;
    constructor(services: Array<Service>);
    lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)): T;
}
