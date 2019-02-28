import {
  EventStreams,
  IEvent,
  IEventStores,
  IEventStream,
  IIdentifier,
  IServiceConfigs,
  IServiceContext,
} from "atomservicescore";
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
  Configs,
): IServiceContext => {
  const Configure = ServiceConfigure(Configs || {});

  return {
    directTo: (ref, data) =>
      EventStream.directTo(ref, data),
    dispatch: async (event) => {
      let criticalException = false;
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
        criticalException = true;
      }

      try {
        if (EventException === undefined) {
          await EventStores.storeEvent(event, scope);
        } else {
          await EventStores.storeEvent(EventException.Event, scope);
        }
      } catch (error) {
        const Exception = EventStoringErrorException(error, event, scope);
        EventException = { Exception, Event: EventStoringError(event, Exception) };
        criticalException = true;
      }

      try {
        if (EventException === undefined) {
          await EventStream.publish(event, { scope, level: Configure.level(event.name) });
        } else {
          await EventStream.publish(EventException.Event, { scope, level: Configure.level(event.name) });

          if (criticalException) {
            throw EventException.Exception;
          }
        }
      } catch (error) {
        throw EventPublishingErrorException(error, event, scope);
      }
    },
    level: (name) =>
      Configure.level(name),
    listenTo: (ref, listener) =>
      EventStream.listenTo(ref, listener),
    newAggregateID: () =>
      Identifier.AggregateID(type),
    newEventID: () =>
      Identifier.EventID(type),
    queryByID: (eventID) =>
      EventStores.queryByID(eventID, { type, scope }),
    queryCurrentVersion: (aggregateID) =>
      EventStores.queryCurrentVersion(aggregateID, { type, scope }),
    queryEventsByAggregateID: (aggregateID, options) =>
      EventStores.queryEventsByAggregateID(aggregateID, { type, scope }, options),
    registerHandler: async ({ name }, process) => {
      const on = { name, type, scope, level: Configure.level(name) };
      await EventStream.subscribe(
        on,
        { channel: "handler", type, scope },
        process,
      );

      return on;
    },
    registerReaction: async (reaction, process) => {
      const { name } = reaction;
      let on: { name: string; type: string; scope: string; level: EventStreams.EventLevel; };

      if (reaction.scope === scope && reaction.type === type) {
        on = { name, type, scope, level: Configure.level(name) };

        await EventStream.subscribe(
          on,
          { channel: "reaction", type, scope },
          process,
        );
      } else {
        on = { name, type: reaction.type, scope: reaction.scope, level: "public" };

        await EventStream.subscribe(
          on,
          { channel: "reaction", type, scope },
          process,
        );
      }

      return on;
    },
    scope: () =>
      scope,
    type: () =>
      type,
  };
})(stores, stream, identifier, configs);

Object.freeze(composeServiceContext);
