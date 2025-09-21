"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("./Service");
const errors_1 = require("../utils/errors");
class ServicesContext {
    constructor(services, mockups) {
        this.services = [];
        this.mockups = null;
        this.mockups = mockups || [];
        this.addServices(services);
    }
    static initialize(services) {
        if (!ServicesContext.instance) {
            ServicesContext.instance = new ServicesContext(services);
        }
    }
    static async waitForInit() {
        return ServicesContext.instance.waitForInit();
    }
    static lookup(dependency) {
        return ServicesContext.instance.lookup(dependency);
    }
    static getAllServices() {
        return ServicesContext.instance.getAllServices();
    }
    static addServices(services) {
        return ServicesContext.instance.addServices(services);
    }
    async waitForInit() {
        return await Promise.all(this.services.map(i => i.awaited()));
    }
    lookup(dependency) {
        if (this.mockups && this.mockups.find(i => i.name === dependency)) {
            return this.mockups.find(i => i.name === dependency).service;
        }
        const found = typeof dependency === 'string' ? this.services.find(i => i.constructor.name === dependency) : this.services.find(i => i instanceof dependency);
        if (!found) {
            throw new errors_1.ServiceNotFoundError(`Context does not contains instance of ${typeof dependency === 'string' ? dependency : dependency.name}.`);
        }
        return found;
    }
    getAllServices() {
        return this.services.reduce((acc, i) => ({
            ...acc,
            [i.constructor.name]: i,
        }), {});
    }
    addServices(services) {
        if (this.mockups) {
            services.forEach(j => {
                const foundMockup = this.mockups.find(i => i.name === j.constructor.name);
                if (foundMockup) {
                    console.info(`Service ${j.constructor.name} is mocked by ${foundMockup.service.constructor.name}.`);
                }
            });
        }
        services.forEach(i => {
            if (this.services.find(j => j.constructor.name === i.constructor.name)) {
                throw new Error(`Service ${i.constructor.name} already exists in context.`);
            }
        });
        this.services = this.services.concat(services);
        setImmediate(() => this.initializeServices(services));
    }
    async initializeServices(services) {
        await Promise.all(services.map(i => i[Service_1.SERVICE_INITIALIZE_ACCESSOR]()));
    }
}
exports.ServicesContext = ServicesContext;
ServicesContext.inject = (dependency, optional) => {
    return (target, memberName) => {
        Object.defineProperty(target, memberName, {
            get: () => {
                try {
                    return ServicesContext.lookup(dependency);
                }
                catch (e) {
                    if (!optional && e instanceof errors_1.ServiceNotFoundError) {
                        throw e;
                    }
                    return null;
                }
            },
        });
    };
};
ServicesContext.injectContext = () => {
    return (target, memberName) => {
        Object.defineProperty(target, memberName, {
            get: () => ServicesContext.getAllServices(),
        });
    };
};
//# sourceMappingURL=ServicesContext.js.map