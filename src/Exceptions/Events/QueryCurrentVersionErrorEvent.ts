import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const QueryCurrentVersionErrorEvent = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("QueryCurrentVersionErrorEvent", event, error);
