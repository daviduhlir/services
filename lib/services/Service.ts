import { EventEmitter } from 'events'

export const SERVICE_INITIALIZE_ACCESSOR = Symbol()

/**
* Base service class
 */
export class Service {
  private internalEmitter: EventEmitter = new EventEmitter();
  private initDone: boolean = false;

  /**
   * Method, that will wait until init of services is completed.
   */
  public async awaited() {
    if (this.initDone) {
      return this
    }
    return new Promise((resolve) => {
      if (this.initDone) {
        resolve(this);
      }
      this.internalEmitter.once('done', resolve)
    });
  }

  /**********************************
   *
   * To be overrided
   *
   **********************************/
  protected waitingDependencies: Service[] = []
  /**
   * Initialize method, to be overrided with your service init.
   */
  protected async initialize(dependecies: Service[] = []) {
    this.waitingDependencies = dependecies
    if (dependecies.some(d => !d)) {
      throw new Error(`ERROR Some of dependecies is not assigned. Please check if you are tring to depend on optional dependecy.`)
    }
    if (dependecies.some(d => d.waitingDependencies.includes(this))) {
      throw new Error(`ERROR Cyclic dependecies detected.`)
    }
    await Promise.all(dependecies.map(s => s.awaited()))
  }

  /**********************************
   *
   * Internal methods
   *
   **********************************/
  [SERVICE_INITIALIZE_ACCESSOR] = async () => {
    await this.initialize()
    this.waitingDependencies = []
    this.initDone = true
    this.internalEmitter.emit('done')
  }
}
