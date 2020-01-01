import { IEvent, IStateHandler } from "atomservicescore";

export interface IStateHandlers {
  type: () => string;
  resolve: (event: IEvent) => IStateHandler;
}
