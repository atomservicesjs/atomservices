import { IEventStores, IEventStream, IIdentifier, IServiceConfigs, IServiceContext } from "atomservicescore";
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
      if (event.type !== type) {
        // Cannot publish a event from different type
      }

      const { version: currentVersion } = await EventStores.queryCurrentVersion(event.aggregateID, { type, scope });

      if ((currentVersion + 1) !== event._version) {
        // Concurrency Conflict
      }

      return EventStream.publish(event, { scope, level: Configure.level(event.name) });
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
        const level = Configure.level(name);

        return EventStream.subscribe(
          { name, type, scope, level },
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
