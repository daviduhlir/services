import { Worker, AsObject } from '@david.uhlir/cluster';
import { BaseService, ServicesContext } from '@david.uhlir/services';

import { TestService1 } from './TestService1'
import { TestService2 } from './TestService2'

export interface Params {}

/**
 * Fork process instance
 *
 * This class will represents worker in cluster.
 */
export class WorkerExampleFork {
    constructor(
        public readonly params: Params,
        public readonly master: AsObject<WorkerExample>,
    ) {
        const serviceContext = new ServicesContext({
            service1: new TestService1(),
            service2: new TestService2(),
        });
    }
}

/**
 * Master process instance
 *
 * This class will represents handler of fork in master process.
 */
export class WorkerExample extends Worker<Params, WorkerExampleFork> {
    constructor(params: Params = {}) {
        super(params);
    }

    // initialize my fork, return receiver object for RPC
    protected async initWorker(params: Params, master: any) {
        return new WorkerExampleFork(params, master);
    }
}
