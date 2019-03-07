import { IEvent, IReaction, Reaction } from "atomservicescore";

export const ReactionBuilder = <Event extends IEvent = IEvent>(
  initial: {
    scope: string;
    type: string;
    name: string;
    react: Reaction.ReactionReact;
  },
): IReaction<Event> =>
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
