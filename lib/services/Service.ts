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
  public async waitForInit() {
    return new Promise((resolve) => {
      if (this.initDone) {
        resolve(0);
      }
      this.internalEmitter.once('done', resolve)
    });
  }

  /**********************************
   *
   * To be overrided
   *
   **********************************/

  /**
   * Initialize method, to be overrided with your service init.
   */
  public async initialize() {}

  /**********************************
   *
   * Internal methods
   *
   **********************************/
  [SERVICE_INITIALIZE_ACCESSOR] = async () => {
    await this.initialize()
    this.initDone = true
    this.internalEmitter.emit('done')
  }
}
