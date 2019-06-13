import { IEvent, IEventHandler } from "atomservicescore";

export interface IEventHandlers {
  type: () => string;
  resolve: (event: IEvent) => IEventHandler;
  forEach: (callback: (handler: IEventHandler) => void) => number;
}
