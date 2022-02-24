import { BaseService } from './BaseService';
export interface ContextServices {
    [name: string]: BaseService<any, any>;
}
export declare class ServicesContext<TContext extends ContextServices = {}> {
    readonly services: TContext;
    constructor(services: TContext);
    protected initialize(): Promise<void>;
    forEachService(callback: (service: BaseService) => (Promise<void> | void)): any;
    forEachServiceSync(callback: (service: BaseService) => void): void;
}
