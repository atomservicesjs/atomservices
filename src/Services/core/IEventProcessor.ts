import { IEvent } from "atomservicescore";

export type EventNameType = "PROCESSED" | "RESULTED" | "UNHANDLED";

export const EventNames = {
  PROCESSED: "PROCESSED",
  RESULTED: "RESULTED",
  UNHANDLED: "UNHANDLED",
};

export interface IEventProcessor {
  on: (eventName: EventNameType, listener: (...args: any[]) => void) => void;
  process: (event: IEvent, processAck: () => Promise<void>) => Promise<void>;
}
