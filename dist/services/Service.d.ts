export declare const SERVICE_INITIALIZE_ACCESSOR: unique symbol;
export declare class Service {
    private internalEmitter;
    private initDone;
    awaited(): Promise<unknown>;
    protected initialize(dependecies?: Service[]): Promise<void>;
    [SERVICE_INITIALIZE_ACCESSOR]: () => Promise<void>;
}
