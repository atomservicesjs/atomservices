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
import { managedEventProcess } from "./managedEventProcess";
import { MetadataRefiner } from "./MetadataRefiner";

export const composeServiceContext = (definition: IServiceDefinition) => ((Definition) => {
  const {
    EventStores,
    EventStream,
    Notifiers,
    ServiceConfigurate,
    ServiceIdentifier,
    ServiceStateStores,
    scope,
    type,
  } = Definition;

  const EventHandlers = composeEventHandlers(...definition.EventHandlers)(type);

  return (options: { isReplay?: boolean; } = {}): IServiceContext => {
    const isReplay = options.isReplay || false;

    const ServiceContext: IServiceContext = {
      AggregateID: () =>
        ServiceIdentifier.AggregateID(),
      EventID: () =>
        ServiceIdentifier.EventID(),
      directTo: (ref, data) =>
        EventStream.directTo(ref, data),
      dispatch: async (event) => {
        // STORE EVENT
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

        // PREPARE
        const metadata = MetadataRefiner.dispatch({ isReplay });
        const processType = ServiceConfigurate.processType(event.name);

        // SYNC PROCESS
        if (processType === "synchronous") {
          const EventHandler = EventHandlers.resolve(event);

          if (EventHandler) {
            const resulting = (data: any) => LocalDirectStream.directTo(event._id, data);
            await managedEventProcess(EventHandler, ServiceContext, resulting, Notifiers, ServiceStateStores);
          }
        }

        // PUBLISH EVENT
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

    return ServiceContext;
  };
})(definition);
