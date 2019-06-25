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
    const ReactionsMap = Reactions.reduce((result: IReactionsMap, reaction) => {
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
        Reactions.forEach((each) => callback(each));

        return Reactions.length;
      },
      resolve: (event, scope) => {
        if (ReactionsMap[scope] &&
          ReactionsMap[scope][event.type] &&
          ReactionsMap[scope][event.type][event.name]) {
          return ReactionsMap[scope][event.type][event.name];
        } else {
          return [];
        }
      },
    };

    Object.freeze(REACTIONS);

    return REACTIONS;
  })(reactions);

Object.freeze(composeReactions);
