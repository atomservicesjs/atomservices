import { EventStreams, IEvent, IReaction, IServiceContext } from "atomservicescore";
import { IReactions } from "../../Reactions/IReactions";

const filterReactions = (event: IEvent, Reactions: IReactions): IReaction[] => {
  const filtered: IReaction[] = [];

  Reactions.forEach((reaction) => {
    if (event.type === reaction.type && event.name === reaction.name) {
      filtered.push(reaction);
    }
  });

  return filtered;
};

export const createReactor = (
  Reactions: IReactions,
  ServiceContext: IServiceContext,
): EventStreams.EventProcess => (event: IEvent, ack: EventStreams.EventProcessAck) => {
  const filtered = filterReactions(event, Reactions);
  const ps = filtered.map((reaction) => reaction.react(event, ServiceContext));

  Promise.all(ps).then(() => ack());
};

Object.freeze(createReactor);
