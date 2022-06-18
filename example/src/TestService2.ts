import { Service, ServicesContext } from '@david.uhlir/services';
import { TestService1 } from './TestService1';

export class TestService2 extends Service {
    @ServicesContext.inject('TestService1')
    protected service: TestService1;

    public async initialize() {
        super.initialize();
        this.service.hello();
    }

    public hello() {
        console.log('Hello from service 2');
    }
}
