import { IEventStream, IIdentifier, IServiceConfigs, IServiceContext } from "atomservicescore";
import { ServiceEventStreamFactory } from "./ServiceEventStreamFactory";
import { ServiceIdentifierFactory } from "./ServiceIdentifierFactory";

export const ServiceContextFactory = {
  create: (
    stream: IEventStream,
    identifier: IIdentifier,
    scope: string,
    type: string,
    configs: IServiceConfigs,
  ): IServiceContext => ((Stream, Identifier, Scope, Type, Configs): IServiceContext => {
    const ServiceStream = ServiceEventStreamFactory.create(Stream, Scope, Type, Configs);
    const ServiceIdentifier = ServiceIdentifierFactory.create(Identifier, Type);

    const Context: IServiceContext = {
      AggregateID: () => ServiceIdentifier.AggregateID(),
      EventID: () => ServiceIdentifier.EventID(),
      dispatch: (event, isReplay = false) => ServiceStream.dispatch(event, isReplay),
      registerHandler: (handler, process) => ServiceStream.registerHandler(handler, process),
      registerReaction: (reaction, react) => ServiceStream.registerReaction(reaction, react),
      scope: () => Scope,
      type: () => Type,
    };

    Object.freeze(Context);

    return Context;
  })(stream, identifier, scope, type, configs),
};

Object.freeze(ServiceContextFactory);