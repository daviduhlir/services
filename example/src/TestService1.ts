import { Service } from '@david.uhlir/services';
import { TestService2 } from './TestService2';

export class TestService1 extends Service {
    @Service.inject(TestService2)
    protected service: TestService2;

    public resolve() {
        super.resolve();
        this.service.hello();
    }

    public hello() {
        console.log('Hello from service 1');
    }
}
