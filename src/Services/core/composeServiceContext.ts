import { IServiceContext, IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import {
  CurrentVersionQueryingErrorException,
  EventPublishingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
  NoEventStoresProvidedException,
} from "../../Exceptions/Core";
import { ServicesNotifyData } from "../../Notifiers";
import { LocalDirectStream } from "../../Streams/LocalDirectStream";
import { MetadataRefiner } from "./MetadataRefiner";

export const composeServiceContext = (definition: IServiceDefinition) => {
  const {
    EventStores,
    EventStream,
    Notifiers,
    ServiceConfigurate,
    ServiceIdentifier,
    scope,
    type,
  } = definition;

  return (options: { isReplay?: boolean; } = {}): IServiceContext => {
    const isReplay = options.isReplay || false;

    const context: IServiceContext = {
      AggregateID: () =>
        ServiceIdentifier.AggregateID(),
      EventID: () =>
        ServiceIdentifier.EventID(),
      directTo: (ref, data) =>
        EventStream.directTo(ref, data),
      dispatch: async (event) => {
        if (EventStores && !isReplay) {
          let version: number;

          try {
            version = (await EventStores.queryCurrentVersion(scope, type, event.aggregateID)).version;
          } catch (error) {
            throw CurrentVersionQueryingErrorException(error, event.aggregateID, type, scope);
          }
          const currentVersion = version;

          if (event._version === undefined && ServiceConfigurate.allowDynamicVersion(event.name)) {
            event._version = currentVersion + 1;
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

        let metadata = MetadataRefiner.dispatch({ isReplay });
        const processType = ServiceConfigurate.processType(event.name);

        if (processType === "synchronous") {
          const EventHandlers = composeEventHandlers(...definition.EventHandlers)(type);
          const ServiceContextComposing = composeServiceContext(definition);

          const EventHandler = EventHandlers.resolve(event);

          if (EventHandler) {
            metadata = MetadataRefiner.consume(metadata);
            const ServiceContext = ServiceContextComposing(metadata);
            const currentState = undefined;

            const result = await EventHandler.process(event, currentState, metadata);
            const resulting = (data: any) => LocalDirectStream.directTo(event._id, data);

            if (EventHandler.processEffect) {
              await EventHandler.processEffect({ event, metadata, result }, resulting, ServiceContext);
            }
          }
        }

        try {
          const on = { level: ServiceConfigurate.level(event.name), scope };

          await EventStream.publish(on, metadata, event);
          Notifiers.emit(ServicesNotifyData.SERVICE_EVENT_DISPATCHED(type, {
            eventID: event._id,
            scope,
            type,
            // tslint:disable-next-line: object-literal-sort-keys
            name: event.name,
            aggregateID: event.aggregateID,
            _createdAt: event._createdAt,
            _createdBy: event._createdBy,
            _version: event._version,
          }, { event }));
        } catch (error) {
          throw EventPublishingErrorException(error, event, scope);
        }
      },
      listenTo: async (ref, listener) =>
        EventStream.listenTo(ref, listener),
      notify: (data) =>
        Notifiers.emit({
          action: data.action,
          component: {
            name: definition.type,
            type: "Service",
          },
          fields: data.fields,
          level: data.level,
          message: data.message,
          obj: data.obj,
        }),
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
