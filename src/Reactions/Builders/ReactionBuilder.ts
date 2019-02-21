import { IReaction, Reactions } from "atomservicescore";

export const ReactionBuilder = <Payloads = any, EventID = any, AggregateID = any, CreatedBy = any>(
  initial: {
    scope: string;
    type: string;
    name: string;
    react: Reactions.Reaction;
  },
): IReaction<Payloads, EventID, AggregateID, CreatedBy> =>
  Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: initial.name,
      writable: false,
    },
    react: {
      configurable: false,
      enumerable: true,
      value: initial.react,
      writable: false,
    },
    scope: {
      configurable: false,
      enumerable: true,
      value: initial.scope,
      writable: false,
    },
    type: {
      configurable: false,
      enumerable: true,
      value: initial.type,
      writable: false,
    },
  });
