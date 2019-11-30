import { IManagedService, IService, IServiceDefinition } from "atomservicescore";
import { ServiceIdentifierFactory } from "../Context/Factories/ServiceIdentifierFactory";
import { ServiceStreamFactory } from "../Context/Factories/ServiceStreamFactory";
import { GlobalScope } from "../GlobalScope";
import { UUIDIdentifier } from "../Identifiers/UUIDIdentifier";
import { composeServiceContext } from "./core/composeServiceContext";
import { connectStream } from "./core/connectStream";

export const createService = (service: IService): IManagedService => ((SERVICE): IManagedService => {
  const InMemoryStream: any = {};
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

  const Service: any = {
    connect: async () =>
      connectStream(definition),
    context: () =>
      composeServiceContext(definition)({ isReplay: false }),
    scope: () =>
      scope,
    type: () =>
      type,
  };

  Object.freeze(Service);

  return Service;
})(service);
