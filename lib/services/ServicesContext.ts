import { BaseService } from './BaseService';

export interface ContextServices {
    [name: string]: BaseService<any, any>;
}

export class ServicesContext<TContext extends ContextServices = {}> {
    constructor(
        public readonly services: TContext,
    ) {
        this.initialize();
    }

    protected async initialize() {
        this.forEachServiceSync((service: BaseService) => service._internalAssignContext(this));
        await this.forEachService((service: BaseService) => service.initialize());
        await this.forEachService((service: BaseService) => service.onMounted());
    }

    /**
     * Call async method for every each service
     */
    public forEachService(callback: (service: BaseService) => (Promise<void> | void)) {
        const servicesNames = Object.keys(this.services);
        return Promise.all(
            servicesNames
                .map((name) => callback(this.services[name]),
            ),
        );
    }

    /**
     * Call sync method for every each service
     */
    public forEachServiceSync(callback: (service: BaseService) => void) {
        const servicesNames = Object.keys(this.services);
        servicesNames
            .forEach((name) => callback(this.services[name]),
        );
    }
}
