"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("./Service");
class ServiceNotFoundError extends Error {
    constructor(message) {
        super(message);
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
    }
}
exports.ServiceNotFoundError = ServiceNotFoundError;
class ServicesContext {
    constructor(services) {
        this.services = services;
        this.services.forEach(service => service[Service_1.SERVICE_SETUP_CONTEXT_ACCESSOR](this));
        this.services.forEach(service => service.resolve());
    }
    lookup(dependency) {
        const found = typeof dependency === 'string' ?
            this.services.find(i => i.constructor.name === dependency) :
            this.services.find(i => i instanceof dependency);
        if (!found) {
            throw new ServiceNotFoundError(`Context does not contains instance of ${typeof dependency === 'string' ? dependency : dependency.name}.`);
        }
        return found;
    }
}
exports.ServicesContext = ServicesContext;
//# sourceMappingURL=ServicesContext.js.map