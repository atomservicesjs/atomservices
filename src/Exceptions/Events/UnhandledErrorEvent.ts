import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const UnhandledErrorEvent = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("UnhandledErrorEvent", event, error);
