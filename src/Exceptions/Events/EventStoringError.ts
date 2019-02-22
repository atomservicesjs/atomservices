import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const EventStoringError = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("EventStoringError", event, error);
