import { IService, IServiceContainer } from "atomservicescore";

export const createContainer = (scope: string): IServiceContainer =>
  ((Scope): IServiceContainer => {
    const Services: IService[] = [];

    const container: any = Object.defineProperties({}, {
      connect: {
        configurable: false,
        enumerable: true,
        value: async () => {
          await Promise.all(Services.map((each) => each.connect()));
        },
        writable: false,
      },
      scope: {
        configurable: false,
        enumerable: true,
        value: () => Scope,
        writable: false,
      },
      service: {
        configurable: false,
        enumerable: true,
        value: (service: IService) => Services.push(service),
        writable: false,
      },
    });

    Object.freeze(container);

    return container;
  })(scope);
