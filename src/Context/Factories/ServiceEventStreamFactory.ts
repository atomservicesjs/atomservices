import { IEventStream, IServiceConfigs, IServiceEventStream } from "atomservicescore";
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
      dispatch: async (event, isReplay = false) => EventStream.publish(event, { level: ServiceStreamLevel.level(event.name), scope: Scope }, isReplay),
      registerHandler: async (handler, process) => {
        const { on } = await EventStream.subscribe(
          {
            level: ServiceStreamLevel.level(handler.name),
            name: handler.name,
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
      registerReaction: async (reaction, react) => {
        const { on } = await EventStream.subscribe(
          {
            level: (reaction.scope === Scope && reaction.type === Type) ? ServiceStreamLevel.level(reaction.name) : "Public",
            name: reaction.name,
            scope: reaction.scope,
            type: reaction.type,
          },
          {
            channel: "EventReaction",
            scope: Scope,
            type: Type,
          },
          (event, processAck) => react(event, reaction.scope, processAck),
        );

        return on;
      },
      scope: () => Scope,
      type: () => Type,
    };

    Object.freeze(ServiceStream);

    return ServiceStream;
  })(stream, scope, type, configs),
};

Object.freeze(ServiceEventStreamFactory);
