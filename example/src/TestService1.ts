import { BaseService } from '@david.uhlir/services';
import { TestService2 } from './TestService2';

export class TestService1 extends BaseService {
    @BaseService.inject(TestService2)
    protected service2: TestService2;

    public resolve() {
        super.resolve();

        console.log('Service reference', this.service2);
        this.service2.hello();
    }
}
