import { Service, ServicesContext } from '@david.uhlir/services';
import { TestService2 } from './TestService2';

export class TestService1 extends Service {
    @ServicesContext.inject(TestService2)
    protected service: TestService2;

    public async initialize() {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.service.hello();
    }

    public hello() {
        console.log('Hello from service 1');
    }
}
