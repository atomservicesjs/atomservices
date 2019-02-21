import { IReaction } from "atomservicescore";

export interface IReactions {
  type: () => string;
  forEach: (callback: (reaction: IReaction) => void) => number;
}
