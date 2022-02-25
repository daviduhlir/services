"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_SETUP_CONTEXT_ACCESSOR = Symbol();
class BaseService {
    constructor() {
        this[_a] = (context) => this.context = context;
    }
    resolve() {
        if (this.preparedInjections) {
            for (const injection of this.preparedInjections) {
                this[injection[0]] = this.context.lookup(injection[1]);
            }
        }
    }
}
exports.BaseService = BaseService;
_a = exports.SERVICE_SETUP_CONTEXT_ACCESSOR;
BaseService.inject = (dependency) => {
    return (target, memberName) => {
        target.preparedInjections = [...(target.preparedInjections ? target.preparedInjections : []), [memberName, dependency]];
    };
};
//# sourceMappingURL=BaseService.js.map