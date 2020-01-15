import { IEvent, IStateHandler } from "atomservicescore";

export interface IStateHandlers {
  type: () => string;
  apply: (events: IEvent[]) => Promise<void>;
  resolve: (event: IEvent) => IStateHandler;
}
