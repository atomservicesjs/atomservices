import { IEvent } from "atomservicescore";

export interface IStateHandlers {
  type: () => string;
  apply: (events: IEvent) => Promise<void>;
}
