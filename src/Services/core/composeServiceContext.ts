import { IServiceContext, IServiceDefinition } from "atomservicescore";
import {
  CurrentVersionQueryingErrorException,
  EventPublishingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
  NoEventStoresProvidedException,
} from "../../Exceptions/Core";
import { MetadataRefiner } from "./MetadataRefiner";

export const composeServiceContext = (definition: IServiceDefinition) => {
  const {
    // EventHandlers,
    EventStores,
    EventStream,
    ServiceIdentifier,
    ServiceStream,
    scope,
    type,
  } = definition;

  return (options?: { isReplay: boolean; }): IServiceContext => {
    const isReplay = options && options.isReplay || false;

    const context: IServiceContext = {
      AggregateID: () =>
        ServiceIdentifier.AggregateID(),
      EventID: () =>
        ServiceIdentifier.EventID(),
      directTo: (ref, data) =>
        EventStream.directTo(ref, data),
      dispatch: async (event) => {
        if (EventStores && !isReplay) {
          let currentVersion: number;

          try {
            const { version } = await EventStores.queryCurrentVersion(scope, type, event.aggregateID);
            currentVersion = version;
          } catch (error) {
            throw CurrentVersionQueryingErrorException(error, event.aggregateID, type, scope);
          }

          if (currentVersion + 1 === event._version) {
            try {
              await EventStores.storeEvent(scope, event);
            } catch (error) {
              throw EventStoringErrorException(error, event, scope);
            }
          } else {
            throw EventVersionConflictedConcurrentException(event, currentVersion, scope);
          }
        }

        try {
          const on = { level: ServiceStream.level(event.name), scope };
          const metadata = MetadataRefiner.dispatch({ isReplay });
          return EventStream.publish(on, metadata, event);
        } catch (error) {
          throw EventPublishingErrorException(error, event, scope);
        }
      },
      listenTo: (ref, listener) =>
        EventStream.listenTo(ref, listener),
      queryCurrentVersion: (aggregateID) => {
        if (EventStores) {
          return EventStores.queryCurrentVersion(scope, type, aggregateID);
        } else {
          throw NoEventStoresProvidedException();
        }
      },
      scope: () =>
        scope,
      type: () =>
        type,
    };

    return context;
  };
};
