import { BaseService } from './BaseService';
export declare class ServicesContext {
    protected services: Array<BaseService>;
    constructor(services: Array<BaseService>);
    lookup<T extends BaseService>(dependency: new (context: ServicesContext) => T): T;
}
