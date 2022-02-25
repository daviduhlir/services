"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("./Service");
const errors_1 = require("../utils/errors");
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
            throw new errors_1.ServiceNotFoundError(`Context does not contains instance of ${typeof dependency === 'string' ? dependency : dependency.name}.`);
        }
        return found;
    }
}
exports.ServicesContext = ServicesContext;
//# sourceMappingURL=ServicesContext.js.map