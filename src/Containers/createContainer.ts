import { IManagedServiceContainer, IServiceContainer } from "atomservicescore";
import { createService } from "../Services/createService";

export const createContainer = (container: IServiceContainer): IManagedServiceContainer =>
  ((CONTAINER): IManagedServiceContainer => {
    const Container: IManagedServiceContainer = {
      connect: async () => {
        const Services = CONTAINER.Services.map((SERVICE) => createService(SERVICE, CONTAINER));

        await Promise.all(Services.map((service) => service.connect()));
      },
    };

    Object.freeze(Container);

    return Container;
  })(container);
