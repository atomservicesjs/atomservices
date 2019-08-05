import { IEventStream, IServiceConfigs, IServiceEventStream } from "atomservicescore";
import { EventPublishingErrorException } from "../../Exceptions/Core";
import { ServiceStreamLevelFactory } from "./ServiceStreamLevelFactory";

export const ServiceEventStreamFactory = {
  create: (
    stream: IEventStream,
    scope: string,
    type: string,
    configs: IServiceConfigs,
  ): IServiceEventStream => ((EventStream, Scope, Type, Configs): IServiceEventStream => {
    const ServiceStreamLevel = ServiceStreamLevelFactory.create(Type, Configs);

    const ServiceStream: IServiceEventStream = {
      directTo: (ref, data) =>
        EventStream.directTo(ref, data),
      dispatch: async (event, metadata) => {
        try {
          return EventStream.publish(event, { level: ServiceStreamLevel.level(event.name), scope: Scope }, metadata);
        } catch (error) {
          throw EventPublishingErrorException(error, event, Scope);
        }
      },
      listenTo: (ref, listener) =>
        EventStream.listenTo(ref, listener),
      registerEventProcess: async ({ name }, process) => {
        const { on } = await EventStream.subscribe(
          {
            level: ServiceStreamLevel.level(name),
            name,
            scope: Scope,
            type: Type,
          },
          {
            channel: "EventHandler",
            scope: Scope,
            type: Type,
          },
          process,
        );

        return on;
      },
      registerEventReact: async (on, react) => {
        const result = await EventStream.subscribe(
          {
            level: (on.scope === Scope && on.type === Type) ? ServiceStreamLevel.level(on.name) : "Public",
            name: on.name,
            scope: on.scope,
            type: on.type,
          },
          {
            channel: "EventReaction",
            scope: Scope,
            type: Type,
          },
          (event, processAck) => react(event, on.scope, processAck),
        );

        return result.on;
      },
      scope: () =>
        Scope,
      type: () =>
        Type,
    };

    Object.freeze(ServiceStream);

    return ServiceStream;
  })(stream, scope, type, configs),
};

Object.freeze(ServiceEventStreamFactory);
