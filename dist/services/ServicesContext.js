"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServicesContext {
    constructor(services) {
        this.services = services;
        this.initialize();
    }
    async initialize() {
        this.forEachServiceSync((service) => service._internalAssignContext(this));
        await this.forEachService((service) => service.initialize());
    }
    forEachService(callback) {
        const servicesNames = Object.keys(this.services);
        return Promise.all(servicesNames
            .map((name) => callback(this.services[name])));
    }
    forEachServiceSync(callback) {
        const servicesNames = Object.keys(this.services);
        servicesNames
            .forEach((name) => callback(this.services[name]));
    }
}
exports.ServicesContext = ServicesContext;
//# sourceMappingURL=ServicesContext.js.map