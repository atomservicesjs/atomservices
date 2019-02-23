import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const CurrentVersionQueryingError = (event: IEvent, error: Error): IEvent =>
  convertToExceptionEvent("CurrentVersionQueryingError", event, error);
