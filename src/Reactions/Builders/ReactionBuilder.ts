import { IEvent, IReaction, Reaction } from "atomservicescore";

export const ReactionBuilder = <Event extends IEvent = IEvent>(
  composed: {
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
      value: composed.name,
      writable: false,
    },
    react: {
      configurable: false,
      enumerable: true,
      value: composed.react,
      writable: false,
    },
    scope: {
      configurable: false,
      enumerable: true,
      value: composed.scope,
      writable: false,
    },
    type: {
      configurable: false,
      enumerable: true,
      value: composed.type,
      writable: false,
    },
  });
