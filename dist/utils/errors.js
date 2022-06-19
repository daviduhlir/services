"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceNotFoundError extends Error {
    constructor(message) {
        super(message);
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            ;
            this.__proto__ = actualProto;
        }
    }
}
exports.ServiceNotFoundError = ServiceNotFoundError;
//# sourceMappingURL=errors.js.map