"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
exports.SERVICE_INITIALIZE_ACCESSOR = Symbol();
class Service {
    constructor() {
        this.internalEmitter = new events_1.EventEmitter();
        this.initDone = false;
        this.waitingDependencies = [];
        this[_a] = async () => {
            if (this.initDone) {
                return;
            }
            await this.initialize();
            this.waitingDependencies = [];
            this.initDone = true;
            this.internalEmitter.emit('done');
        };
    }
    async awaited() {
        if (this.initDone) {
            return this;
        }
        return new Promise(resolve => {
            if (this.initDone) {
                resolve(this);
            }
            this.internalEmitter.once('done', () => resolve(this));
        });
    }
    async initialize(dependecies = []) {
        this.waitingDependencies = dependecies;
        if (dependecies.some(d => !d)) {
            throw new Error(`ERROR Some of dependecies is not assigned. Please check if you are tring to depend on optional dependecy.`);
        }
        if (dependecies.some(d => d.waitingDependencies.includes(this))) {
            throw new Error(`ERROR Cyclic dependecies detected.`);
        }
        await Promise.all(dependecies.map(s => s.awaited()));
    }
}
exports.Service = Service;
_a = exports.SERVICE_INITIALIZE_ACCESSOR;
//# sourceMappingURL=Service.js.map