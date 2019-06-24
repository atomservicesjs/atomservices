import { IEvent } from "atomservicescore";

export interface IEventReactor {
  react: (event: IEvent, scope: string, processAck: () => Promise<void>) => Promise<void>;
}
