import { IManagedService, IService, IServiceContainer, IServiceDefinition } from "atomservicescore";
import { ServiceConfigurateFactory } from "../Context/Factories/ServiceConfigurateFactory";
import { ServiceIdentifierFactory } from "../Context/Factories/ServiceIdentifierFactory";
import { ServiceStateStoresFactory } from "../Context/Factories/ServiceStateStoresFactory";
import { GlobalScope } from "../GlobalScope";
import { UUIDIdentifier } from "../Identifiers/UUIDIdentifier";
import { composeNotifiers, ServicesNotifyData } from "../Notifiers";
import { LocalInMemoryEventStream } from "../Streams";
import { composeServiceContext } from "./core/composeServiceContext";
import { connectStream } from "./core/connectStream";
import { createCommandDispatcher } from "./core/createCommandDispatcher";

export const createService = (service: IService, container?: IServiceContainer): IManagedService => ((SERVICE, CONTAINER): IManagedService => {
  const {
    CommandHandlers = [],
    EventHandlers = [],
    Reactions = [],
    EventStores = (CONTAINER && CONTAINER.EventStores),
    StateStores = (CONTAINER && CONTAINER.StateStores),
    EventStream = (CONTAINER && CONTAINER.EventStream) || LocalInMemoryEventStream,
    Identifier = (CONTAINER && CONTAINER.Identifier) || UUIDIdentifier,
    configs = {},
    scope = (CONTAINER && CONTAINER.scope) || GlobalScope,
    type,
  } = SERVICE;
  const ContainerNotifiers = (CONTAINER && CONTAINER.Notifiers) || [];
  const ServiceNotifiers = SERVICE.Notifiers || [];
  const NOTIFIERS = composeNotifiers(...ServiceNotifiers, ...ContainerNotifiers);

  const definition: IServiceDefinition = {
    CommandHandlers,
    EventHandlers,
    EventStores,
    EventStream,
    Notifiers: NOTIFIERS,
    Reactions,
    ServiceConfigurate: ServiceConfigurateFactory.create(configs),
    ServiceIdentifier: ServiceIdentifierFactory.create(Identifier, type),
    ServiceStateStores: ServiceStateStoresFactory.create(scope, type, StateStores),
    configs,
    scope,
    type,
  };

  const CommandDispatcher = createCommandDispatcher(definition);

  const Service: IManagedService = {
    connect: async () => {
      connectStream(definition);

      if (StateStores) {
        await StateStores.connect(definition);
      }

      NOTIFIERS.emit(ServicesNotifyData.SERVICE_CONNECTED(SERVICE.type));
    },
    context: (options) =>
      composeServiceContext(definition)(options),
    dispatch: async (command, listening) => {
      NOTIFIERS.emit(ServicesNotifyData.SERVICE_COMMAND_DISPATCHING(SERVICE.type, {
        scope: SERVICE.scope,
        type: SERVICE.type,
        // tslint:disable-next-line: object-literal-sort-keys
        name: command.name,
      }, {
        command,
      }));

      const result = await CommandDispatcher.dispatch(command, listening);

      if (!result.accept) {
        if (result.status === "error") {
          NOTIFIERS.error(ServicesNotifyData.SERVICE_COMMAND_ERROR(SERVICE.type, {
            scope: SERVICE.scope,
            type: SERVICE.type,
            // tslint:disable-next-line: object-literal-sort-keys
            name: command.name,
          }, {
            command,
          }), result.error);
        }

        if (result.status === "invalid") {
          NOTIFIERS.emit(ServicesNotifyData.SERVICE_COMMAND_INVALID(SERVICE.type, {
            scope: SERVICE.scope,
            type: SERVICE.type,
            // tslint:disable-next-line: object-literal-sort-keys
            name: command.name,
            invalidAttributes: result.invalidAttributes,
          }, {
            command,
          }));
        }

        if (result.status === "unhandled") {
          NOTIFIERS.emit(ServicesNotifyData.SERVICE_COMMAND_UNHANDLED(SERVICE.type, {
            scope: SERVICE.scope,
            type: SERVICE.type,
            // tslint:disable-next-line: object-literal-sort-keys
            name: command.name,
          }, {
            command,
          }));
        }
      }

      return result;
    },
    scope: () =>
      scope,
    type: () =>
      type,
  };

  Object.freeze(Service);

  NOTIFIERS.emit(ServicesNotifyData.SERVICE_CREATED(type, {
    scope: SERVICE.scope,
    type: SERVICE.type,
    // tslint:disable-next-line: object-literal-sort-keys
    configs: SERVICE.configs,
    defined: {
      EventStores: (SERVICE.EventStores && true) || false,
      EventStream: (SERVICE.EventStream && true) || false,
      Identifier: (SERVICE.Identifier && true) || false,
    },
  }));

  return Service;
})(service, container);
