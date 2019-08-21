import { EventStream, IEventStores, IEventStream, IIdentifier, IServiceConfigs, IServiceContext } from "atomservicescore";
import { ServiceIdentifierFactory } from "../../Context/Factories/ServiceIdentifierFactory";
import { ServiceStreamLevelFactory } from "../../Context/Factories/ServiceStreamLevelFactory";
import {
  CurrentVersionQueryingErrorException,
  EventPublishingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
  NoEventStoresProvidedException,
} from "../../Exceptions/Core";

export const composeServiceContext = (
  scope: string,
  type: string,
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
  stores?: IEventStores,
) => ((Scope, Type, Identifier, EStream, Configs, EStores) => {
  const ServiceIdentifier = ServiceIdentifierFactory.create(Identifier, Type);
  const ServiceStreamLevel = ServiceStreamLevelFactory.create(Type, Configs);

  return (isReplay: boolean): IServiceContext => {
    const Context: IServiceContext = {
      AggregateID: () => ServiceIdentifier.AggregateID(),
      EventID: () => ServiceIdentifier.EventID(),
      directTo: (ref, data) => EStream.directTo(ref, data),
      dispatch: async (event) => {
        if (EStores && !isReplay) {
          let currentVersion: number;

          try {
            const meta = await EStores.queryCurrentVersion(Scope, Type, event.aggregateID);
            currentVersion = meta.version;
          } catch (error) {
            throw CurrentVersionQueryingErrorException(error, event.aggregateID, Type, Scope);
          }

          if (currentVersion + 1 === event._version) {
            try {
              await EStores.storeEvent(Scope, event);
            } catch (error) {
              throw EventStoringErrorException(error, event, Scope);
            }
          } else {
            throw EventVersionConflictedConcurrentException(event, currentVersion, Scope);
          }
        }

        try {
          const metadata: EventStream.IStreamMetadata = { isReplay };
          return EStream.publish(event, metadata, { level: ServiceStreamLevel.level(event.name), scope: Scope });
        } catch (error) {
          throw EventPublishingErrorException(error, event, Scope);
        }
      },
      listenTo: (ref, listener) =>
        EStream.listenTo(ref, listener),
      queryCurrentVersion: (aggregateID) => {
        if (EStores) {
          return EStores.queryCurrentVersion(Scope, Type, aggregateID);
        } else {
          throw NoEventStoresProvidedException();
        }
      },
      scope: () =>
        Scope,
      type: () =>
        Type,
    };

    Object.freeze(Context);

    return Context;
  };
})(scope, type, identifier, stream, configs, stores);

Object.freeze(composeServiceContext);
