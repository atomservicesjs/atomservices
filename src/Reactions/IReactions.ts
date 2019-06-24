import { IEvent, IReaction } from "atomservicescore";

export interface IReactions {
  type: () => string;
  resolve: (event: IEvent, scope: string) => IReaction[];
  forEach: (callback: (reaction: IReaction) => void) => number;
}
