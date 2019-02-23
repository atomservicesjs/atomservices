import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const EventPublishingError = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("EventPublishingError", event, error);
