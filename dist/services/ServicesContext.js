"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("./Service");
const errors_1 = require("../utils/errors");
class ServicesContext {
    constructor(services) {
        this.services = [];
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