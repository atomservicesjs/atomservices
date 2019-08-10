import { Core, IServiceConfigs, Service } from "atomservicescore";
import { ServiceIdentifierFactory } from "../../Context/Factories/ServiceIdentifierFactory";
import { ServiceStreamLevelFactory } from "../../Context/Factories/ServiceStreamLevelFactory";
import {
  CurrentVersionQueryingErrorException,
  EventPublishingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
} from "../../Exceptions/Core";

export const composeServiceContext = (
  scope: string,
  type: string,
  identifier: Core.IIdentifier,
  stream: Core.IEventStream,
  configs: IServiceConfigs,
  stores?: Core.IEventStores,
) => ((Scope, Type, Identifier, EventStream, Configs, EventStores) => {
  const ServiceIdentifier = ServiceIdentifierFactory.create(Identifier, Type);
  const ServiceStreamLevel = ServiceStreamLevelFactory.create(Type, Configs);

  return (isReplay: boolean): Service.IServiceContext => {
    const Context: Service.IServiceContext = {
      AggregateID: () => ServiceIdentifier.AggregateID(),
      EventID: () => ServiceIdentifier.EventID(),
      directTo: (ref, data) => EventStream.directTo(ref, data),
      dispatch: async (event) => {
        if (EventStores && !isReplay) {
          let currentVersion: number;

          try {
            const meta = await EventStores.queryCurrentVersion(Scope, Type, event.aggregateID);
            currentVersion = meta.version;
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

        try {
          const metadata: Core.EventStream.IStreamMetadata = { isReplay };
          return EventStream.publish(event, metadata, { level: ServiceStreamLevel.level(event.name), scope: Scope });
        } catch (error) {
          throw EventPublishingErrorException(error, event, Scope);
        }
      },
      listenTo: (ref, listener) =>
        EventStream.listenTo(ref, listener),
      scope: () => Scope,
      type: () => Type,
    };

    Object.freeze(Context);

    return Context;
  };
})(scope, type, identifier, stream, configs, stores);

Object.freeze(composeServiceContext);
