import { IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IServiceConfigs } from "atomservicescore";
import { ServiceStreamLevelFactory } from "../../Context/Factories/ServiceStreamLevelFactory";
import { composeEventProcessor } from "./composeEventProcessor";
import { composeEventReactor } from "./composeEventReactor";
import { IConnectStream } from "./IConnectStream";

export const DefaultConnectStream: IConnectStream = async (
  scope: string,
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
  components: {
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  },
  enhancers: {
    EventStores?: IEventStores,
  },
) => {
  const { EventHandlers = [], Reactions = [] } = components;
  const { type } = configs;

  const ps: Array<Promise<any>> = [];
  const Levels = ServiceStreamLevelFactory.create(type, configs);
  const EventProcessor = composeEventProcessor(scope, identifier, stream, configs, EventHandlers, enhancers);

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
      EventProcessor,
    ));
  }

  const ReducedReactions = Reactions.reduce((result, each) => {
    if (!result[each.scope]) {
      result[each.scope] = [];
    }

    result[each.scope].push(each);

    return result;
  }, {} as { [scope: string]: IReaction[]; });

  const ComposeEventReactor = composeEventReactor(scope, identifier, stream, configs, Reactions, enhancers);

  for (const key of Object.keys(ReducedReactions)) {
    const EventReactor = ComposeEventReactor(key);
    const reactions = ReducedReactions[key];

    for (const reaction of reactions) {
      ps.push(stream.subscribe(
        {
          level: (reaction.scope === scope && reaction.type === type) ? Levels.level(reaction.name) : "Public",
          name: reaction.name,
          scope: reaction.scope,
          type: reaction.type,
        },
        {
          channel: "EventReaction",
          scope,
          type,
        },
        EventReactor,
      ));
    }
  }

  await Promise.all(ps);
};

Object.freeze(DefaultConnectStream);
