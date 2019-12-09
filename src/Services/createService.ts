import { IManagedService, IService, IServiceContainer, IServiceDefinition } from "atomservicescore";
import { ServiceIdentifierFactory } from "../Context/Factories/ServiceIdentifierFactory";
import { ServiceStreamFactory } from "../Context/Factories/ServiceStreamFactory";
import { GlobalScope } from "../GlobalScope";
import { UUIDIdentifier } from "../Identifiers/UUIDIdentifier";
import { composeNotifiers } from "../Notifiers/composeNotifiers";
import { ServicesNotifyData } from "../Notifiers/data/ServicesNotifyData";
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
    EventStream = (CONTAINER && CONTAINER.EventStream) || LocalInMemoryEventStream,
    Identifier = (CONTAINER && CONTAINER.Identifier) || UUIDIdentifier,
    configs = {},
    scope = (CONTAINER && CONTAINER.scope) || GlobalScope,
    type,
  } = SERVICE;
  const ContainerNotifiers = (CONTAINER && CONTAINER.Notifiers) || [];
  const ServiceNotifiers = SERVICE.Notifiers || [];
  const Notifiers = composeNotifiers(...ServiceNotifiers, ...ContainerNotifiers);

  const definition: IServiceDefinition = {
    CommandHandlers,
    EventHandlers,
    EventStores,
    EventStream,
    Reactions,
    ServiceIdentifier: ServiceIdentifierFactory.create(Identifier, type),
    ServiceStream: ServiceStreamFactory.create(configs),
    configs,
    scope,
    type,
  };
  const CommandDispatcher = createCommandDispatcher(definition);

  const Service: IManagedService = {
    connect: async () =>
      connectStream(definition),
    context: (options) =>
      composeServiceContext(definition)(options),
    dispatch: async (command, listening) =>
      CommandDispatcher.dispatch(command, listening),
    scope: () =>
      scope,
    type: () =>
      type,
  };

  Object.freeze(Service);

  Notifiers.emit(ServicesNotifyData.SERVICE_CREATED(type, {
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
