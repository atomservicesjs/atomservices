import { IEventStream, IManagedService, IService, IServiceDefinition } from "atomservicescore";
import { ServiceIdentifierFactory } from "../Context/Factories/ServiceIdentifierFactory";
import { ServiceStreamFactory } from "../Context/Factories/ServiceStreamFactory";
import { GlobalScope } from "../GlobalScope";
import { UUIDIdentifier } from "../Identifiers/UUIDIdentifier";
import { LocalInMemoryEventStream } from "../Streams";
import { composeServiceContext } from "./core/composeServiceContext";
import { connectStream } from "./core/connectStream";

export const createService = (service: IService): IManagedService => ((SERVICE): IManagedService => {
  const InMemoryStream: IEventStream = LocalInMemoryEventStream;
  const {
    EventHandlers = [],
    Reactions = [],
    EventStores,
    EventStream = InMemoryStream,
    Identifier = UUIDIdentifier,
    configs = {},
    scope = GlobalScope,
    type,
  } = SERVICE;
  const definition: IServiceDefinition = {
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

  const Service: IManagedService = {
    connect: async () =>
      connectStream(definition),
    context: (options) =>
      composeServiceContext(definition)(options),
    dispatch: async (command, listening) => {

    },
    scope: () =>
      scope,
    type: () =>
      type,
  };

  Object.freeze(Service);

  return Service;
})(service);
