import { IReaction } from "atomservicescore";
import { IReactions } from "./IReactions";

export const combineReactions = (...reactions: IReaction[]) =>
  (type: string): IReactions =>
    ((Reactions: IReaction[]): IReactions => {
      return {
        forEach: (callback) => {
          Reactions.forEach((reaction) => callback(reaction));

          return Reactions.length;
        },
        type: () => type,
      };
    })(reactions);

Object.freeze(combineReactions);
