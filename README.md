# Services util for server applications

This utility is some kind of dependency injection, but it's really simple.
It's provided by decorators, and it's assign reference to instance of service
to variable.
To initialize your context (where services will be initialized) just call something.
like this:

```ts
import { ServicesContext } from '@david.uhlir/services';

ServicesContext.initialize([
    new TestService1(),
    new TestService2(),
]);
```

## Usage

```ts
import { Service } from '@david.uhlir/services';
import { TestService2 } from './TestService2';

export class TestService1 extends Service {
    @ServicesContext.inject(TestService2)
    protected service: TestService2;
}
```

ISC