import { IEvent, IEventStores, IEventStream, IIdentifier, IServiceConfigs, IServiceContext } from "atomservicescore";
import {
  CurrentVersionQueryingErrorException,
  EventPublishingErrorException,
  EventStoringErrorException,
  EventVersionConflictedConcurrentException,
} from "../../Exceptions/Core";
import {
  CurrentVersionQueryingError,
  EventStoringError,
  EventVersionConflictedConcurrent,
} from "../../Exceptions/Events";
import { ExtendException } from "../../Exceptions/ExtendException";
import { ServiceConfigure } from "../../Services/ServiceConfigure";

export const composeServiceContext = (
  stores: IEventStores,
  stream: IEventStream,
  identifier: IIdentifier,
) => (type: string, scope: string, configs?: IServiceConfigs): IServiceContext => ((
  EventStores,
  EventStream,
  Identifier,
): IServiceContext => {
  const Configure = ServiceConfigure(configs = {});

  return {
    fromRef: (ref, listener) =>
      EventStream.fromRef(ref, listener),
    level: (name) =>
      Configure.level(name),
    newAggregateID: () =>
      Identifier.AggregateID(type),
    newEventID: () =>
      Identifier.EventID(type),
    publish: async (event) => {
      let EventException: { Exception: ExtendException; Event: IEvent; } | undefined;

      try {
        const { version: currentVersion } = await EventStores.queryCurrentVersion(event.aggregateID, { type, scope });

        if (event._version !== (currentVersion + 1)) {
          const Exception = EventVersionConflictedConcurrentException(event, currentVersion, scope);
          EventException = { Exception, Event: EventVersionConflictedConcurrent(event, Exception, currentVersion) };
        }
      } catch (error) {
        const Exception = CurrentVersionQueryingErrorException(error, event.aggregateID, type, scope);
        EventException = { Exception, Event: CurrentVersionQueryingError(event, Exception) };
      }

      if (EventException === undefined) {
        try {
          await EventStores.storeEvent(event, scope);
        } catch (error) {
          const Exception = EventStoringErrorException(error, event, scope);
          EventException = { Exception, Event: EventStoringError(event, Exception) };
        }
      }

      try {
        if (EventException === undefined) {
          return EventStream.publish(event, { scope, level: Configure.level(event.name) });
        } else {
          return EventStream.publish(EventException.Event, { scope, level: Configure.level(event.name) });
        }
      } catch (error) {
        throw EventPublishingErrorException(error, event, scope);
      }
    },
    queryByID: (eventID) =>
      EventStores.queryByID(eventID, { type, scope }),
    queryCurrentVersion: (aggregateID) =>
      EventStores.queryCurrentVersion(aggregateID, { type, scope }),
    queryEventsByAggregateID: (aggregateID, options) =>
      EventStores.queryEventsByAggregateID(aggregateID, { type, scope }, options),
    react: (on, reactor) => {
      if (on.scope === scope && on.type === type) {
        const name = on.name;

        return EventStream.subscribe(
          { name, type, scope, level: Configure.level(name) },
          { type, scope },
          reactor,
        );
      } else {
        return EventStream.subscribe(
          { name: on.name, type: on.type, scope: on.scope, level: "public" },
          { type, scope },
          reactor,
        );
      }
    },
    scope: () =>
      scope,
    subscribe: (name, process) =>
      EventStream.subscribe(
        { name, type, scope, level: Configure.level(name) },
        { type, scope },
        process,
      ),
    toRef: (ref, result) =>
      EventStream.toRef(ref, result),
    type: () =>
      type,
  };
})(stores, stream, identifier);

Object.freeze(composeServiceContext);
