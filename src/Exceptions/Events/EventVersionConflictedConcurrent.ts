import { IEvent } from "atomservicescore";
import { convertToExceptionEvent } from "./common/convertToExceptionEvent";

export const EventVersionConflictedConcurrent = (event: IEvent, error: Error, currentVersion: number): IEvent => {
  const exceptionEvent = convertToExceptionEvent("EventVersionConflictedConcurrent", event, error);
  exceptionEvent._version = currentVersion + 1;

  return exceptionEvent;
};
