import { IManagedService, IManagedServiceContainer, IServiceContainer } from "atomservicescore";
import { createService } from "../Services/createService";

export const createContainer = (container: IServiceContainer): IManagedServiceContainer =>
  ((CONTAINER): IManagedServiceContainer => {
    const SERVICES = CONTAINER.Services.reduce((result, SERVICE) => {
      const service = createService(SERVICE, CONTAINER);
      const type = service.type();
      result[type] = service;

      return result;
    }, {} as { [type: string]: IManagedService; });

    const Container: IManagedServiceContainer = {
      connect: async () => {
        await Promise.all(Object.keys(SERVICES).map((type) => SERVICES[type].connect()));
      },
      dispatch: async (type, command, listening) => {
        const service = SERVICES[type];

        return service.dispatch(command, listening);
      },
      service: (type) =>
        SERVICES[type],
    };

    Object.freeze(Container);

    return Container;
  })(container);
