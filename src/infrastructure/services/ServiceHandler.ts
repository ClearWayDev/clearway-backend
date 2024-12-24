import {
    AwilixContainer,
    createContainer,
    InjectionMode,
    asClass,
    Lifetime,
    asValue,
  } from 'awilix';
  
  export type GetService<T> = {
    service: T | null;
  };
  
  export class ServiceHandler {
    private static container: AwilixContainer = createContainer({
      injectionMode: InjectionMode.PROXY,
      strict: true,
    });
  
    public static registerSinglton<T>(
      serviceName: string,
      classForInit: new (...args: any[]) => T,
    ): boolean {
      const registrationData: any = {};
      registrationData[serviceName] = asClass(classForInit, {
        lifetime: Lifetime.SINGLETON,
      });
      try {
        this.container.register(registrationData);
      } catch (e) {
        return false;
      }
      return true;
    }
    public static registerTransient<T>(
      serviceName: string,
      classForInit: new (...args: any[]) => T,
    ): boolean {
      const registrationData: any = {};
      registrationData[serviceName] = asClass(classForInit, {
        lifetime: Lifetime.TRANSIENT,
      });
      try {
        this.container.register(registrationData);
      } catch (e) {
        return false;
      }
      return true;
    }
    public static registerScoped<T>(
      serviceName: string,
      classForInit: new (...args: any[]) => T,
    ): boolean {
      const registrationData: any = {};
      registrationData[serviceName] = asClass(classForInit, {
        lifetime: Lifetime.SCOPED,
      });
      try {
        this.container.register(registrationData);
      } catch (e) {
        return false;
      }
      return true;
    }
  
    public static registerValue(serviceName: string, value: any): boolean {
      const registrationData: any = {};
      registrationData[serviceName] = asValue(value);
      try {
        this.container.register(registrationData);
      } catch (e) {
        return false;
      }
      return true;
    }
  
    public static getService<T>(serviceName: string): GetService<T> {
      try {
        const service = this.container.resolve(serviceName);
        return { service: service };
      } catch (e) {
        console.warn(e + '   ' + serviceName);
        return { service: null };
      }
    }
  }
  