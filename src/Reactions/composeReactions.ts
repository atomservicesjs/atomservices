import { IReaction } from "atomservicescore";
import { IReactions } from "./IReactions";

interface IReactionsMap {
  [scope: string]: {
    [type: string]: {
      [name: string]: IReaction[];
    };
  };
}

export const composeReactions = (...reactions: IReaction[]): IReactions =>
  ((Reactions: IReaction[]): IReactions => {
    const REACTIONS_MAP = Reactions.reduce((result: IReactionsMap, reaction) => {
      if (result[reaction.scope] === undefined) {
        result[reaction.scope] = {};
      }

      if (result[reaction.scope][reaction.type] === undefined) {
        result[reaction.scope][reaction.type] = {};
      }

      if (result[reaction.scope][reaction.type][reaction.name] === undefined) {
        result[reaction.scope][reaction.type][reaction.name] = [];
      }

      result[reaction.scope][reaction.type][reaction.name].push(reaction);

      return result;
    }, {} as IReactionsMap);

    const REACTIONS: IReactions = {
      forEach: (callback) => {
        for (const reaction of Reactions) {
          callback(reaction);
        }

        return Reactions.length;
      },
      resolve: (event, scope) => {
        if (REACTIONS_MAP[scope] &&
          REACTIONS_MAP[scope][event.type] &&
          REACTIONS_MAP[scope][event.type][event.name]) {
          return REACTIONS_MAP[scope][event.type][event.name];
        } else {
          return [];
        }
      },
    };

    Object.freeze(REACTIONS);

    return REACTIONS;
  })(reactions);

Object.freeze(composeReactions);
