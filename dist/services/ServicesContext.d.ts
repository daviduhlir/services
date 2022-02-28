/// <reference types="node" />
import { Service } from './Service';
import { EventEmitter } from 'events';
export declare class ServicesContext<TServices extends Array<Service>> {
    protected services: TServices;
    constructor(services: TServices);
    waitForInit(): Promise<unknown>;
    lookup<T extends Service>(dependency: string | (new (context: ServicesContext<TServices>) => T)): T;
    getAllServices(): {
        [name: string]: Service;
    };
    protected internalEmitter: EventEmitter;
    protected initDone: boolean;
    protected initializeServices(): Promise<void>;
}
