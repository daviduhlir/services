/// <reference types="node" />
import { Service } from './Service';
import { EventEmitter } from 'events';
export declare class ServicesContext {
    protected services: Array<Service>;
    protected internalEmitter: EventEmitter;
    protected initDone: boolean;
    constructor(services: Array<Service>);
    protected initializeServices(): Promise<void>;
    waitForInit(): Promise<unknown>;
    lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)): T;
}
