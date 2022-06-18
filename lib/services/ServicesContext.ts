import { Service } from './Service';
import { ServiceNotFoundError } from '../utils/errors';
import { EventEmitter } from 'events';

export type ServiceDependecyConstructor = new (context: ServicesContext) => Service

/**
 * Services context
 */
export class ServicesContext {
  /**********************************
   *
   * Decorators methods
   *
   **********************************/


  /**
   * Inject service decorator, this will fill in property with service reference if found
   * @param dependency dependecy constructor
   * @param optional will ignore errors, if service will not be found in context
   * @returns
   */
   public static inject = (dependency: string | ServiceDependecyConstructor, optional?: boolean) => {
    return (target: any, memberName: string) => {
      Object.defineProperty(target, memberName, {
        get: () => {
          try {
            return ServicesContext.lookup(dependency)
          } catch(e) {
            if (!optional && e instanceof ServiceNotFoundError) {
                throw e
            }
            return null
          }
        }
      })
    }
  }

  /**
   * Inject service decorator, this will fill in property with service reference if found
   * @param dependency dependecy constructor
   * @param optional will ignore errors, if service will not be found in context
   * @returns
   */
  public static injectContext = () => {
    return (target: any, memberName: string) => {
      Object.defineProperty(target, memberName, {
        get: () => ServicesContext.getAllServices()
      })
    }
  }

  /**********************************
   *
   * Public methods
   *
   **********************************/

  public static initialize(services: Array<Service>) {
    if (!ServicesContext.instance) {
      ServicesContext.instance = new ServicesContext(services)
    }
  }

  /**
   * Method, that will wait until init of services is completed.
   */
  public static async waitForInit() {
    return ServicesContext.instance.waitForInit()
  }

  /**
   * Lookup for dependency. You can use string name instead of constructor.
   * @param dependency
   * @returns
   */
  public static lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)) {
    return ServicesContext.instance.lookup(dependency)
  }

  /**
   * Get all services as object
   * @returns
   */
  public static getAllServices(): {[name: string]: Service} {
    return ServicesContext.instance.getAllServices()
  }

  /**********************************
   *
   * Protected
   *
   **********************************/
  protected static instance: ServicesContext

  /**
   * Init with all services
   * @param services
   */
  protected constructor(
    protected services: Array<Service>,
  ) {
    setImmediate(() => this.initializeServices())
  }

  /**
   * Method, that will wait until init of services is completed.
   */
  protected async waitForInit() {
    return new Promise((resolve) => {
      if (this.initDone) {
        resolve(0);
      }
      this.internalEmitter.once('done', resolve)
    });
  }

  /**
   * Lookup for dependency. You can use string name instead of constructor.
   * @param dependency
   * @returns
   */
  protected lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)) {
    const found = typeof dependency === 'string' ?
      this.services.find(i => i.constructor.name === dependency) :
      this.services.find(i => i instanceof dependency);

    if (!found) {
      throw new ServiceNotFoundError(`Context does not contains instance of ${typeof dependency === 'string' ? dependency : dependency.name}.`);
    }
    return found as T;
  }

  /**
   * Get all services as object
   * @returns
   */
  protected getAllServices(): {[name: string]: Service} {
    return this.services.reduce((acc, i) => ({
      ...acc,
      [i.constructor.name]: i,
    }), {});
  }

  /**********************************
   *
   * Internal methods
   *
   **********************************/
  protected internalEmitter: EventEmitter = new EventEmitter();
  protected initDone: boolean = false;

  /**
   * Internal services initializations
   */
  protected async initializeServices() {
    await Promise.all(this.services.map(i => i.initialize()));
    this.initDone = true;
    this.internalEmitter.emit('done');
  }
}
