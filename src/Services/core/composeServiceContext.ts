import { IServiceContext, IServiceDefinition } from "atomservicescore";
import {
  CurrentVersionQueryingErrorException,
  EventPublishingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
  NoEventStoresProvidedException,
} from "../../Exceptions/Core";

export const composeServiceContext = (definition: IServiceDefinition) => {
  const {
    EventStores,
    EventStream,
    ServiceIdentifier,
    ServiceStreamLevel,
    scope,
    type,
  } = definition;

  return (isReplay: boolean): IServiceContext => {
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
          const metadata = { isReplay };
          return EventStream.publish(event, metadata, { level: ServiceStreamLevel.level(event.name), scope });
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
