import { BaseService } from '@david.uhlir/services';
import { TestService2 } from './TestService2';

export class TestService1 extends BaseService<{}, {
    service2: TestService2,
}> {
    constructor() {
        super({});
    }

    /**
     * Initialize will be called after context creation
     */
    public async initialize() {
        this.inject(['service2']);

        console.log('Service1 reference: ', this.context.service2);
    }
}
