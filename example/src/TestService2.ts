import { Service } from '@david.uhlir/services';
import { TestService1 } from './TestService1';

export class TestService2 extends Service {
    @Service.inject(TestService1)
    protected service: TestService1;

    public resolve() {
        super.resolve();
        this.service.hello();
    }

    public hello() {
        console.log('Hello from service 2');
    }
}
