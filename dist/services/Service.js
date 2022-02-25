"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
exports.SERVICE_SETUP_CONTEXT_ACCESSOR = Symbol();
class Service {
    constructor() {
        this[_a] = (context) => this.context = context;
    }
    resolve() {
        if (this.preparedInjections) {
            for (const injection of this.preparedInjections) {
                try {
                    this[injection.memberName] = this.context.lookup(injection.dependency);
                }
                catch (e) {
                    if (!injection.optional && e instanceof errors_1.ServiceNotFoundError) {
                        throw e;
                    }
                    this[injection.memberName] = null;
                }
            }
        }
    }
    async initialize() { }
}
exports.Service = Service;
_a = exports.SERVICE_SETUP_CONTEXT_ACCESSOR;
Service.inject = (dependency, optional) => {
    return (target, memberName) => {
        target.preparedInjections = [...(target.preparedInjections ? target.preparedInjections : []), { memberName, dependency, optional }];
    };
};
//# sourceMappingURL=Service.js.map