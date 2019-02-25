import { IReaction, Reaction } from "atomservicescore";

export const createReaction = <Payloads = any, EventID = any, AggregateID = any, CreatedBy = any>(
  scope: string,
  type: string,
  name: string,
  react: Reaction.ReactionReact,
): IReaction<Payloads, EventID, AggregateID, CreatedBy> => {
  const reaction: IReaction<Payloads, EventID, AggregateID, CreatedBy> = Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: name,
      writable: false,
    },
    react: {
      configurable: false,
      enumerable: true,
      value: react,
      writable: false,
    },
    scope: {
      configurable: false,
      enumerable: true,
      value: scope,
      writable: false,
    },
    type: {
      configurable: false,
      enumerable: true,
      value: type,
      writable: false,
    },
  });

  return reaction;
};

Object.freeze(createReaction);
