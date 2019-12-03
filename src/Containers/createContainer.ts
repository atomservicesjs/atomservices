import { IManagedService, IManagedServiceContainer, IServiceContainer } from "atomservicescore";
import { createService } from "../Services/createService";

export const createContainer = (container: IServiceContainer): IManagedServiceContainer =>
  ((CONTAINER): IManagedServiceContainer => {
    let SERVICES: { [type: string]: IManagedService } = {};

    const Container: IManagedServiceContainer = {
      connect: async () => {
        const Services = CONTAINER.Services.map((SERVICE) => createService(SERVICE, CONTAINER));
        await Promise.all(Services.map((service) => service.connect()));

        SERVICES = Services.reduce((result, service) => {
          const type = service.type();
          result[type] = service;

          return result;
        }, SERVICES);
      },
      dispatch: (type) => async (command, listening) => {
        const service = SERVICES[type];

        return service.dispatch(command, listening);
      },
      service: (type) =>
        SERVICES[type],
    };

    Object.freeze(Container);

    return Container;
  })(container);
