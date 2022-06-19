import { EventEmitter } from 'events'
import { LookupDescriptor } from './ServicesContext';

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

  /**
   * Initialize method, to be overrided with your service init.
   */
  protected async initialize(dependecies: Service[] = []) {
    await Promise.all(dependecies.map(s => s.awaited()))
  }

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
