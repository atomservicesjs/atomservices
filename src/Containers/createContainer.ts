import { IService, IServiceContainer } from "atomservicescore";

export const createContainer = (scope: string, ...services: IService[]): IServiceContainer =>
  ((Scope, Services): IServiceContainer => {
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
    });

    Object.freeze(container);

    return container;
  })(scope, services);
