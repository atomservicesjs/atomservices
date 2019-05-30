import { IEvent } from "atomservicescore";

export interface IEventProcessor {
  process: (event: IEvent) => Promise<void>;
  scope: () => string;
  type: () => string;
}
