import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const UnhandledError = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("UnhandledError", event, error);
