import { EventStream } from "atomservicescore";

/*
export type EventNameType = "PROCESSED" | "RESULTED" | "UNHANDLED";

export const EventNames = {
  PROCESSED: "PROCESSED",
  RESULTED: "RESULTED",
  UNHANDLED: "UNHANDLED",
};*/

export interface IEventProcessor {
  process: EventStream.EventProcess;
}
