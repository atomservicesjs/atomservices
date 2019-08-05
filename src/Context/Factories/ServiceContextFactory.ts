import { IEventStores, IEventStream, IIdentifier, IServiceConfigs, IServiceContext } from "atomservicescore";
import {
  CurrentVersionQueryingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
} from "../../Exceptions/Core";
import { ServiceEventStreamFactory } from "./ServiceEventStreamFactory";
import { ServiceIdentifierFactory } from "./ServiceIdentifierFactory";

export const ServiceContextFactory = {
  create: (
    stream: IEventStream,
    identifier: IIdentifier,
    scope: string,
    type: string,
    configs: IServiceConfigs,
    options: {
      EventStores?: IEventStores,
    } = {},
  ): IServiceContext => ((EventStream, Identifier, Scope, Type, Configs, Options): IServiceContext => {
    const ServiceStream = ServiceEventStreamFactory.create(EventStream, Scope, Type, Configs);
    const ServiceIdentifier = ServiceIdentifierFactory.create(Identifier, Type);
    const { EventStores } = Options;

    const Context: IServiceContext = {
      AggregateID: () => ServiceIdentifier.AggregateID(),
      EventID: () => ServiceIdentifier.EventID(),
      directTo: (ref, data) => ServiceStream.directTo(ref, data),
      dispatch: async (event, metadata) => {
        if (EventStores) {
          let currentVersion: number;

          try {
            const result = await EventStores.queryCurrentVersion(Scope, Type, event.aggregateID);
            currentVersion = result.version;
          } catch (error) {
            throw CurrentVersionQueryingErrorException(error, event.aggregateID, Type, Scope);
          }

          if (currentVersion + 1 === event._version) {
            try {
              await EventStores.storeEvent(Scope, event);
            } catch (error) {
              throw EventStoringErrorException(error, event, Scope);
            }
          } else {
            throw EventVersionConflictedConcurrentException(event, currentVersion, Scope);
          }
        }

        return ServiceStream.dispatch(event, metadata);
      },
      listenTo: (ref, listener) => ServiceStream.listenTo(ref, listener),
      registerEventProcess: (on, process) => ServiceStream.registerEventProcess(on, process),
      registerEventReact: (on, react) => ServiceStream.registerEventReact(on, react),
      scope: () => Scope,
      type: () => Type,
    };

    Object.freeze(Context);

    return Context;
  })(stream, identifier, scope, type, configs, options),
};

Object.freeze(ServiceContextFactory);
