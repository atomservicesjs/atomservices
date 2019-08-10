import { Core, IReaction, IServiceConfigs } from "atomservicescore";
import { composeReactions } from "../../Reactions/composeReactions";
import { composeServiceContext } from "./composeServiceContext";
import { IEventReactor } from "./IEventReactor";

export const composeEventReactor = (
  scope: string,
  identifier: Core.IIdentifier,
  stream: Core.IEventStream,
  stores?: Core.IEventStores,
) => (
  configs: IServiceConfigs,
  ...reactions: IReaction[]
): IEventReactor => ((Scope, Identifier, EventStream, EventStores, Configs, Reactions): IEventReactor => {
  const { type: Type } = Configs;
  const EventReactions = composeReactions(...Reactions);

  const ComposeServiceContext = composeServiceContext(Scope, Type, Identifier, EventStream, Configs, EventStores);

  const reactor: IEventReactor = {
    react: async (event, eventscope, metadata, processAck) => {
      const collection = EventReactions.resolve(event, eventscope);

      if (collection.length > 0) {
        const reacts: Array<Promise<any>> = [];
        const ServiceContext = ComposeServiceContext(metadata.isReplay);

        for (const reaction of collection) {
          reacts.push(reaction.react(event, eventscope, ServiceContext, metadata));
        }

        await Promise.all(reacts);
      }

      await processAck();
    },
  };

  Object.freeze(reactor);

  return reactor;
})(scope, identifier, stream, stores, configs, reactions);

Object.freeze(composeEventReactor);
