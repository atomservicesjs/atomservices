import { IManagedService, IService, IServiceDefinition } from "atomservicescore";
import { ServiceIdentifierFactory } from "../Context/Factories/ServiceIdentifierFactory";
import { ServiceStreamLevelFactory } from "../Context/Factories/ServiceStreamLevelFactory";
import { GlobalScope } from "../GlobalScope";
import { UUIDIdentifier } from "../Identifiers/UUIDIdentifier";
import { composeServiceContext } from "./core/composeServiceContext";
import { StreamConnect } from "./core/StreamConnect";

export const createService = (service: IService): IManagedService => ((SERVICE): IManagedService => {
  const InMemoryStream: any = {};
  const {
    EventHandlers = [],
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
    ServiceIdentifier: ServiceIdentifierFactory.create(Identifier, type),
    ServiceStreamLevel: ServiceStreamLevelFactory.create(configs),
    configs,
    scope,
    type,
  };

  const Service: any = {
    connect: async () =>
      StreamConnect(definition),
    context: () =>
      composeServiceContext(definition)(false),
    scope: () =>
      scope,
    type: () =>
      type,
  };

  Object.freeze(Service);

  return Service;
})(service);
