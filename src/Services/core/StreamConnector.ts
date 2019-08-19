import { IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IServiceConfigs } from "atomservicescore";
import { ServiceStreamLevelFactory } from "../../Context/Factories/ServiceStreamLevelFactory";
import { composeEventProcessor } from "./composeEventProcessor";
import { composeEventReactor } from "./composeEventReactor";
import { IStreamConnector } from "./IStreamConnector";

export const StreamConnector: IStreamConnector = {
  connect: async (
    scope: string,
    type: string,
    configs: IServiceConfigs,
    identifier: IIdentifier,
    stream: IEventStream,
    components: {
      EventHandlers: IEventHandler[];
      Reactions: IReaction[];
    },
    stores?: IEventStores,
  ) => {
    const { EventHandlers, Reactions } = components;
    const ps: Array<Promise<any>> = [];
    const EventProcessor = composeEventProcessor(scope, identifier, stream, stores)(configs, ...EventHandlers);
    const EventReactor = composeEventReactor(scope, identifier, stream, stores)(configs, ...Reactions);
    const Levels = ServiceStreamLevelFactory.create(type, configs);

    for (const EventHandler of EventHandlers) {
      ps.push(stream.subscribe(
        {
          level: Levels.level(EventHandler.name),
          name: EventHandler.name,
          scope,
          type,
        }, {
          channel: "EventHandler",
          scope,
          type,
        },
        (event, metadata, processAck) => EventProcessor.process(event, metadata, processAck),
      ));
    }

    for (const Reaction of Reactions) {
      ps.push(stream.subscribe(
        {
          level: (Reaction.scope === scope && Reaction.type === type) ? Levels.level(Reaction.name) : "Public",
          name: Reaction.name,
          scope: Reaction.scope,
          type: Reaction.type,
        }, {
          channel: "EventReaction",
          scope,
          type,
        },
        (event, metadata, processAck) => EventReactor.react(event, scope, metadata, processAck),
      ));
    }

    await Promise.all(ps);
  },
};

Object.freeze(StreamConnector);
