import { ServiceHandler } from './ServiceHandler';

type ServiceToInject = {
  serviceName: string;
  implemetation: any;
  type?: 'singleton' | 'transient' | 'scoped';
  isValue?: boolean;
};

export class InjectedServices {
  private _servicesList: ServiceToInject[] = [];

  constructor(servicesList: ServiceToInject[]) {
    this._servicesList = servicesList;
    this.injectServices();
  }

  private injectServices(): boolean {
    try {
      this._servicesList.forEach(
        ({ type, serviceName, implemetation, isValue }) => {
          if (!isValue) {
            if (type === 'singleton') {
              ServiceHandler.registerSinglton(serviceName, implemetation);
            } else if (type === 'transient') {
              ServiceHandler.registerTransient(serviceName, implemetation);
            } else if (type === 'scoped') {
              ServiceHandler.registerScoped(serviceName, implemetation);
            }
          } else {
            ServiceHandler.registerValue(serviceName, implemetation);
          }
        },
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
