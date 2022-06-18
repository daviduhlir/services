import { ServicesContext } from '@david.uhlir/services';

import { TestService1 } from './TestService1'
import { TestService2 } from './TestService2'

/**
 * Fork process instance
 *
 * This class will represents worker in cluster.
 */
export class WorkerExample {
    constructor() {
        this.start();
    }

    public async start() {
        ServicesContext.initialize([
            new TestService1(),
            new TestService2(),
        ]);

        // wait until all services is done with init
        await ServicesContext.waitForInit();

        console.log('Initialized');
    }
}
