/*
import { IService, IServiceContainer, IServiceContainerConfigs } from "atomservicescore";

export const createContainer = (configs: IServiceContainerConfigs, ...services: IService[]): IServiceContainer =>
  ((Configs, Services): IServiceContainer => {
    const container: IServiceContainer = {
      connect: async () => {
        await Promise.all(Services.map((each) => each.connect()));
      },
    };

    Object.freeze(container);

    return container;
  })(configs, services);
*/
