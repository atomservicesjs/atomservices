import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const QueryCurrentVersionError = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("QueryCurrentVersionError", event, error);
