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
      directTo: (ref, data) => ServiceStream.directTo(ref, data),
      dispatch: (event, isReplay = false) => ServiceStream.dispatch(event, isReplay),
      listenTo: (ref, listener) => ServiceStream.listenTo(ref, listener),
      registerEventProcess: (on, process) => ServiceStream.registerEventProcess(on, process),
      registerEventReact: (on, react) => ServiceStream.registerEventReact(on, react),
      scope: () => Scope,
      type: () => Type,
    };

    Object.freeze(Context);

    return Context;
  })(stream, identifier, scope, type, configs),
};

Object.freeze(ServiceContextFactory);
