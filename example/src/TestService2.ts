import { BaseService } from '@david.uhlir/services';
import { TestService1 } from './TestService1';

export class TestService2 extends BaseService {
    public hello() {
        console.log('Hello world');
    }
}
