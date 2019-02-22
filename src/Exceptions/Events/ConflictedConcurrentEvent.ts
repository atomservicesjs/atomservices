import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const ConflictedConcurrentEvent = (event: IEvent, error: Error, currentVersion: number): IEvent => {
  const exceptionEvent = convertToExceptionEvent("ConflictedConcurrentEvent", event, error);
  exceptionEvent._version = currentVersion + 1;

  return exceptionEvent;
};
