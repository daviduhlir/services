"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseService {
    constructor(config = {}) {
        this.config = config;
        this.injectedDependecies = {};
        this.dependeciesProxy = new Proxy({}, {
            get: (target, name) => {
                if (!this.injectedDependecies[name]) {
                    throw new Error(`Trying to get not injected dependecy ${name}. Use inject method before.`);
                }
                return this.injectedDependecies[name];
            },
        });
    }
    get context() {
        return this.dependeciesProxy;
    }
    async initialize() { }
    async inject(dependecies) {
        if (!this.servicesContext) {
            throw new Error(`Trying to inject dependecies before services initialization. Use initialize method to inject dependencies.`);
        }
        const names = dependecies;
        for (const name of names) {
            if (!this.servicesContext.services[name]) {
                throw new Error(`Dependecy ${name} of service was not found in context.`);
            }
            this.injectedDependecies[name] = this.servicesContext.services[name];
        }
    }
    _internalAssignContext(context) {
        this.servicesContext = context;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map