export declare const SERVICE_INITIALIZE_ACCESSOR: unique symbol;
export declare class Service {
    private internalEmitter;
    private initDone;
    waitForInit(): Promise<unknown>;
    initialize(): Promise<void>;
    [SERVICE_INITIALIZE_ACCESSOR]: () => Promise<void>;
}
