/// <reference types="node" />
import { Service } from './Service';
import { EventEmitter } from 'events';
export declare class ServicesContext {
    protected services: Array<Service>;
    constructor(services: Array<Service>);
    waitForInit(): Promise<unknown>;
    lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)): T;
    protected internalEmitter: EventEmitter;
    protected initDone: boolean;
    protected initializeServices(): Promise<void>;
}
