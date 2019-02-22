import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const PublishUnmatchedEventType = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("PublishUnmatchedEventType", event, error);
