// 🎯 Dependency Injection Container - Because who likes new-ing up classes manually?

// 🏭 Factory function type - Creates our dependencies
type Factory<T> = () => T;

// 🎁 Service definition - How we register our services
interface ServiceDefinition<T> {
  factory: Factory<T>;     // 🏭 Function that creates the service
  singleton?: boolean;     // 🔒 Should we reuse the same instance?
  instance?: T;           // 📦 Cached instance for singletons
}

// 🎮 Container - The brain of our dependency injection
export class Container {
  // 🗺️ Map of service names to their definitions
  #services = new Map<string, ServiceDefinition<any>>();

  // 📝 Register a service with the container
  register<T>(name: string, factory: Factory<T>, singleton = true): void {
    this.#services.set(name, { factory, singleton });
  }

  // 🔍 Check if a service exists
  has(name: string): boolean {
    return this.#services.has(name);
  }

  // 🎣 Get a service from the container
  resolve<T>(name: string): T {
    const service = this.#services.get(name);
    if (!service) {
      throw new Error(`🚨 Service ${name} not found! Did you forget to register it?`);
    }

    // 🔒 For singletons, create once and reuse
    if (service.singleton) {
      service.instance ??= service.factory();
      return service.instance;
    }

    // 🏭 For non-singletons, create new instance every time
    return service.factory();
  }

  // 🧹 Clear all service instances (useful for testing)
  clear(): void {
    this.#services.clear();
  }
}

// 🚀 Create a global container instance
export const container = new Container();
