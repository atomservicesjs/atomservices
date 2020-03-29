import { IEvent, IServiceContext, IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeStateApplier } from "../../States/composeStateApplier";
import { composeStateHandlers } from "../../States/composeStateHandlers";

import { ServicesNotifyData } from "../../Notifiers";
import { LocalDirectStream } from "../../Streams/LocalDirectStream";
import { MetadataRefiner } from "./MetadataRefiner";

import {
  CurrentVersionQueryingErrorException,
  EventPublishingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
  NoEventStoresProvidedException,
  NotAllowedDynamicVersionErrorException,
} from "../../Exceptions/Core";

import { operateEventProcess } from "./operateEventProcess";

export const isEventVersionDefined = (event: IEvent) => (event._version && event._version > 0);

export const composeServiceContext = (definition: IServiceDefinition) => ((Definition) => {
  const {
    EventStores,
    EventStream,
    Notifiers,
    ServiceConfigurate,
    ServiceIdentifier,
    scope,
    type,
  } = Definition;

  const EventHandlers = composeEventHandlers(...definition.EventHandlers)(type);
  const StateHandlers = composeStateHandlers(...definition.StateHandlers)(type);
  const StateApplier = composeStateApplier({ StateHandlers });

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
        const versioning = ServiceConfigurate.versioning(event.name);
        let eventVersion: number | undefined;

        // VERSIONING
        if (versioning === "None") {
          eventVersion = undefined;
        } else {
          eventVersion = event._version;

          // STORE EVENT
          if (EventStores && !isReplay) {
            let version: number;

            try {
              version = (await EventStores.queryCurrentVersion(scope, type, event.aggregateID)).version;
            } catch (error) {
              throw CurrentVersionQueryingErrorException(error, event.aggregateID, type, scope);
            }

            const currentVersion = version;

            if (!isEventVersionDefined(event)) {
              if (versioning === "Dynamic") {
                eventVersion = currentVersion + 1;
                event._version = eventVersion;
              } else {
                throw NotAllowedDynamicVersionErrorException(event, scope);
              }
            }

            if (currentVersion + 1 === eventVersion) {
              try {
                await EventStores.storeEvent(scope, event);
              } catch (error) {
                throw EventStoringErrorException(error, event, scope);
              }
            } else {
              throw EventVersionConflictedConcurrentException(event, currentVersion, scope);
            }
          } else {
            if (!isEventVersionDefined(event)) {
              if (versioning === "Dynamic") {
                eventVersion = -1;
                event._version = eventVersion;
              } else {
                throw NotAllowedDynamicVersionErrorException(event, scope);
              }
            }
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
            await operateEventProcess(EventHandler, StateApplier, ServiceContext, resulting, Notifiers)(Definition, event, metadata);
          }
        }

        // PUBLISH EVENT
        try {
          const on = { level: ServiceConfigurate.level(event.name), scope };

          await EventStream.publish({ event, metadata, on });
          Notifiers.emit(ServicesNotifyData.SERVICE_EVENT_DISPATCHED(type, {
            eventID: event._id,
            scope,
            type,
            // tslint:disable-next-line: object-literal-sort-keys
            name: event.name,
            aggregateID: event.aggregateID,
            _createdAt: event._createdAt,
            _createdBy: event._createdBy,
            _version: eventVersion,
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
