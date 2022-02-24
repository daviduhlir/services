import { BaseService } from '@david.uhlir/services';
import { TestService1 } from './TestService1';

export class TestService2 extends BaseService<{}, {
    service1: TestService1,
}> {
    constructor() {
        super({});
    }

    /**
     * Initialize will be called after context creation
     */
    public async initialize() {
        this.inject(['service1']);

        console.log('Service2 reference: ', this.context.service1);
    }
}
