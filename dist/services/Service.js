"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
exports.SERVICE_INITIALIZE_ACCESSOR = Symbol();
class Service {
    constructor() {
        this.internalEmitter = new events_1.EventEmitter();
        this.initDone = false;
        this[_a] = async () => {
            await this.initialize();
            this.initDone = true;
            this.internalEmitter.emit('done');
        };
    }
    async waitForInit() {
        return new Promise((resolve) => {
            if (this.initDone) {
                resolve(0);
            }
            this.internalEmitter.once('done', resolve);
        });
    }
    async initialize() { }
}
exports.Service = Service;
_a = exports.SERVICE_INITIALIZE_ACCESSOR;
//# sourceMappingURL=Service.js.map