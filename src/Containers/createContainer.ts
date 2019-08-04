import { IService, IServiceContainer } from "atomservicescore";

export const createContainer = (scope: string): IServiceContainer =>
  ((Scope): IServiceContainer => {
    let IsConnected = false;
    const RegisteredServicePromises: Array<Promise<IService>> = [];

    const container: any = Object.defineProperties({}, {
      connect: {
        configurable: false,
        enumerable: true,
        value: async () => {
          const services = await Promise.all(RegisteredServicePromises);
          await Promise.all(services.map((each) => each.connect()));
          IsConnected = true;
        },
        writable: false,
      },
      isConnected: {
        configurable: false,
        enumerable: true,
        get: () => IsConnected,
      },
      registerService: {
        configurable: false,
        enumerable: true,
        value: (service: IService) => {
          const promise = new Promise<IService>((resolve, reject) => {
            if (IsConnected) {
              service.connect()
                .then(() => resolve(service))
                .catch((error) => reject(error));
            } else {
              resolve(service);
            }
          });

          RegisteredServicePromises.push(promise);

          return promise;
        },
        writable: false,
      },
      scope: {
        configurable: false,
        enumerable: true,
        value: () => Scope,
        writable: false,
      },
    });

    Object.freeze(container);

    return container;
  })(scope);
