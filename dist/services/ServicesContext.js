"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = require("./BaseService");
class ServicesContext {
    constructor(services) {
        this.services = services;
        this.services.forEach(service => service[BaseService_1.SERVICE_SETUP_CONTEXT_ACCESSOR](this));
        this.services.forEach(service => service.resolve());
    }
    lookup(dependency) {
        const found = this.services.find(i => i instanceof dependency);
        if (!found) {
            throw new Error(`Context does not contains instance of requested service to be injected`);
        }
        return found;
    }
}
exports.ServicesContext = ServicesContext;
//# sourceMappingURL=ServicesContext.js.map