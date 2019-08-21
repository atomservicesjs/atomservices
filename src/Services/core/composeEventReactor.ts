import { IEventStores, IEventStream, IIdentifier, IReaction, IServiceConfigs } from "atomservicescore";
import { composeReactions } from "../../Reactions/composeReactions";
import { composeServiceContext } from "./composeServiceContext";
import { StreamProcessing } from "./StreamProcessing";

export const composeEventReactor = (
  scope: string,
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
  reactions: IReaction[],
  enhancers: {
    EventStores?: IEventStores,
  },
) => ((Scope, Identifier, EventStream, Configs, Reactions, Enhancers) => {
  const { type: Type } = Configs;
  const { EventStores } = Enhancers;
  const EventReactions = composeReactions(...Reactions)(Type);
  const ComposeServiceContext = composeServiceContext(Scope, Type, Identifier, EventStream, Configs, EventStores);

  const composeProcessing = (eventScope: string) => {
    const processing: StreamProcessing = async (event, metadata, processAck) => {
      const resolvedReactions = EventReactions.resolve(event, eventScope);

      if (resolvedReactions.length > 0) {
        const reacts: Array<Promise<any>> = [];
        const ServiceContext = ComposeServiceContext(metadata.isReplay);

        for (const reaction of resolvedReactions) {
          reacts.push(reaction.react(event, ServiceContext, metadata));
        }

        await Promise.all(reacts);
      }

      await processAck();
    };

    Object.freeze(processing);

    return processing;
  };

  return composeProcessing;
}) (scope, identifier, stream, configs, reactions, enhancers);

Object.freeze(composeEventReactor);
