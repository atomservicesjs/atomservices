import { IService, IServiceContainer } from "atomservicescore";

export const createContainer = (
  scope: string,
  ...services: IService[]
): IServiceContainer =>
  ((Scope, Services): IServiceContainer => {
    const container: IServiceContainer = {
      connect: async () => {
        await Promise.all(Services.map((each) => each.connect()));
      },
      scope: () =>
        Scope,
    };

    Object.freeze(container);

    return container;
  })(scope, services);
