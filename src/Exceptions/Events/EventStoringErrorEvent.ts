import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const EventStoringErrorEvent = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("EventStoringErrorEvent", event, error);
