import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const PublishUnmatchedEventTypeEvent = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("PublishUnmatchedEventTypeEvent", event, error);
