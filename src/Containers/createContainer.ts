import { IManagedService, IManagedServiceContainer, IServiceContainer } from "atomservicescore";
import { composeNotifiers, ContainersNotifyData } from "../Notifiers";
import { createService } from "../Services/createService";

export const createContainer = (container: IServiceContainer): IManagedServiceContainer =>
  ((CONTAINER): IManagedServiceContainer => {
    const ContainerNotifiers = CONTAINER.Notifiers || [];
    const NOTIFIERS = composeNotifiers(...ContainerNotifiers);

    const SERVICES = CONTAINER.Services.reduce((result, SERVICE) => {
      const service = createService(SERVICE, CONTAINER);
      const type = service.type();
      result[type] = service;

      return result;
    }, {} as { [type: string]: IManagedService; });

    const Container: IManagedServiceContainer = {
      connect: async () => {
        await Promise.all(Object.keys(SERVICES).map((type) => SERVICES[type].connect()));

        NOTIFIERS.emit(ContainersNotifyData.CONTAINER_CONNECTED(CONTAINER.scope));
      },
      dispatch: async (type, command, listening) => {
        const service = SERVICES[type];

        return service.dispatch(command, listening);
      },
      service: (type) =>
        SERVICES[type],
    };

    Object.freeze(Container);

    NOTIFIERS.emit(ContainersNotifyData.CONTAINER_CREATED(CONTAINER.scope, {
      scope: CONTAINER.scope,
      // tslint:disable-next-line: object-literal-sort-keys
      defined: {
        EventStores: (CONTAINER.EventStores && true) || false,
        EventStream: (CONTAINER.EventStream && true) || false,
        Identifier: (CONTAINER.Identifier && true) || false,
      },
    }));

    return Container;
  })(container);
