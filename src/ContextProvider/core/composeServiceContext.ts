import { IEvent, IEventStores, IEventStream, IIdentifier, IServiceConfigs, IServiceContext } from "atomservicescore";
import {
  ConflictedConcurrentEventException,
  EventStoringErrorException,
  PublishUnmatchedEventTypeException,
  QueryCurrentVersionErrorException,
} from "../../Exceptions/Core";
import {
  ConflictedConcurrentEvent,
  EventStoringErrorEvent,
  PublishUnmatchedEventTypeEvent,
  QueryCurrentVersionErrorEvent,
  UnhandledErrorEvent,
} from "../../Exceptions/Events";
import { ServiceConfigure } from "../../Services/ServiceConfigure";

export const storeConcurrentEvent = async (event: IEvent, scope: string, stores: IEventStores) => {
  const { aggregateID, type, _version: version } = event;
  let currentVersion;

  try {
    const qr = await stores.queryCurrentVersion(aggregateID, { type, scope });
    currentVersion = qr.version;
  } catch (error) {
    throw QueryCurrentVersionErrorException(error, type, aggregateID);
  }

  if (version === (currentVersion + 1)) {
    try {
      return stores.storeEvent(event, scope);
    } catch (error) {
      throw EventStoringErrorException(error, event);
    }
  } else {
    throw ConflictedConcurrentEventException(currentVersion, event);
  }
};

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
      let ErrorEvent;

      try {
        if (event.type !== type) {
          const exception = PublishUnmatchedEventTypeException(event, type);
          event = PublishUnmatchedEventTypeEvent(event, exception);
        }

        await storeConcurrentEvent(event, scope, EventStores);
      } catch (error) {
        let storableErrorEvent;

        if (error.code === "000010") {
          ErrorEvent = QueryCurrentVersionErrorEvent(event, error);
        } else if (error.code === "000011") {
          ErrorEvent = EventStoringErrorEvent(event, error);
        } else if (error.code === "000100") {
          ErrorEvent = ConflictedConcurrentEvent(event, error, error.currentVersion);
          storableErrorEvent = ErrorEvent;
        } else {
          ErrorEvent = UnhandledErrorEvent(event, error);
        }

        if (storableErrorEvent !== undefined) {
          await storeConcurrentEvent(storableErrorEvent, scope, EventStores);
        }
      }

      if (ErrorEvent === undefined) {
        return EventStream.publish(event, { scope, level: Configure.level(name) });
      } else {
        return EventStream.publish(ErrorEvent, { scope, level: Configure.level(name) });
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
