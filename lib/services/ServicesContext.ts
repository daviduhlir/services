import { Service, SERVICE_INITIALIZE_ACCESSOR } from './Service'
import { ServiceNotFoundError } from '../utils/errors'

export type ServiceDependecyConstructor = new (context: ServicesContext) => Service
export type LookupDescriptor<T extends Service = Service> = string | (new (context: ServicesContext) => T)

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
          } catch (e) {
            if (!optional && e instanceof ServiceNotFoundError) {
              throw e
            }
            return null
          }
        },
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
        get: () => ServicesContext.getAllServices(),
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
  public static lookup<T extends Service>(dependency: LookupDescriptor<T>) {
    return ServicesContext.instance.lookup(dependency)
  }

  /**
   * Get all services as object
   * @returns
   */
  public static getAllServices(): { [name: string]: Service } {
    return ServicesContext.instance.getAllServices()
  }

  /**
   * Add services to context
   */
  public static addServices(services: Array<Service>) {
    return ServicesContext.instance.addServices(services)
  }

  /**********************************
   *
   * Protected
   *
   **********************************/
  protected static instance: ServicesContext
  protected services: Array<Service> = []
  protected mockups: Array<{ name: string; service: Service }> = null

  /**
   * Init with all services
   * @param services
   */
  protected constructor(services: Array<Service>, mockups?: Array<{ name: string; service: Service }>) {
    this.mockups = mockups || []
    this.addServices(services)
  }

  /**
   * Method, that will wait until init of services is completed.
   */
  protected async waitForInit() {
    return await Promise.all(this.services.map(i => i.awaited()))
  }

  /**
   * Lookup for dependency. You can use string name instead of constructor.
   * @param dependency
   * @returns
   */
  protected lookup<T extends Service>(dependency: string | (new (context: ServicesContext) => T)) {
    if (this.mockups && this.mockups.find(i => i.name === dependency)) {
      return this.mockups.find(i => i.name === dependency)!.service as T
    }
    const found =
      typeof dependency === 'string' ? this.services.find(i => i.constructor.name === dependency) : this.services.find(i => i instanceof dependency)

    if (!found) {
      throw new ServiceNotFoundError(`Context does not contains instance of ${typeof dependency === 'string' ? dependency : dependency.name}.`)
    }
    return found as T
  }

  /**
   * Get all services as object
   * @returns
   */
  protected getAllServices(): { [name: string]: Service } {
    return this.services.reduce(
      (acc, i) => ({
        ...acc,
        [i.constructor.name]: i,
      }),
      {},
    )
  }

  /**
   * Add services to context
   */
  protected addServices(services: Array<Service>) {
    if (this.mockups) {
      services.forEach(j => {
        const foundMockup = this.mockups.find(i => i.name === j.constructor.name)
        if (foundMockup) {
          console.info(`Service ${j.constructor.name} is mocked by ${foundMockup.service.constructor.name}.`)
        }
      })
    }
    services.forEach(i => {
      if (this.services.find(j => j.constructor.name === i.constructor.name)) {
        throw new Error(`Service ${i.constructor.name} already exists in context.`)
      }
    })
    this.services = this.services.concat(services)
    setImmediate(() => this.initializeServices(services))
  }

  /**********************************
   *
   * Internal methods
   *
   **********************************/

  /**
   * Internal services initializations
   */
  protected async initializeServices(services: Array<Service>) {
    await Promise.all(services.map(i => i[SERVICE_INITIALIZE_ACCESSOR]()))
  }
}
