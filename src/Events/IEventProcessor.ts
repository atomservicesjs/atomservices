import { IEvent } from "atomservicescore";

export interface IEventProcessor {
  scope: () => string;
  type: () => string;
  process: (event: IEvent) => Promise<any>;
}
