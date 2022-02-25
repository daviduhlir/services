"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const ServicesContext_1 = require("./ServicesContext");
exports.SERVICE_SETUP_CONTEXT_ACCESSOR = Symbol();
class Service {
    constructor() {
        this[_a] = (context) => this.context = context;
    }
    resolve() {
        console.log(this.preparedInjections);
        if (this.preparedInjections) {
            for (const injection of this.preparedInjections) {
                try {
                    this[injection.memberName] = this.context.lookup(injection.dependency);
                }
                catch (e) {
                    if (!injection.optional && e instanceof ServicesContext_1.ServiceNotFoundError) {
                        throw e;
                    }
                    this[injection.memberName] = null;
                }
            }
        }
    }
}
exports.Service = Service;
_a = exports.SERVICE_SETUP_CONTEXT_ACCESSOR;
Service.inject = (dependency, optional) => {
    return (target, memberName) => {
        target.preparedInjections = [...(target.preparedInjections ? target.preparedInjections : []), { memberName, dependency, optional }];
    };
};
//# sourceMappingURL=Service.js.map