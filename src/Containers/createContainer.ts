import { IService, IServiceContainer } from "atomservicescore";

export const createContainer = (...services: IService[]): IServiceContainer =>
  ((Services): IServiceContainer => {
    const container: IServiceContainer = {
      connect: async () => {
        await Promise.all(Services.map((each) => each.connect()));
      },
    };

    Object.freeze(container);

    return container;
  })(services);
