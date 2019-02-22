import { IEvent } from "atomservicescore";
import Constants from "./Constants";
import { createException } from "./createException";

export const CombineDuplicatedCommandHandlersException = (type: string, name: string) =>
  createException(Constants["000001_CombineDuplicatedCommandHandlers"], `{ type: ${type}, name: ${name} }`);

export const CombineDuplicatedEventHandlersException = (type: string, name: string) =>
  createException(Constants["000002_CombineDuplicatedEventHandlers"], `{ type: ${type}, name: ${name} }`);

export const CombineDuplicatedQueryHandlersException = (type: string, name: string) =>
  createException(Constants["000003_CombineDuplicatedQueryHandlers"], `{ type: ${type}, name: ${name} }`);

export const QueryCurrentVersionErrorException = (error: Error, type: string, aggregateID: any) =>
  createException(
    Constants["000010_QueryCurrentVersionError"],
    `error occured during querying a current version`,
    {
      innerError: error,
      query: {
        aggregateID,
        type,
      },
    },
  );

export const EventStoringErrorException = (error: Error, event: IEvent) =>
  createException(
    Constants["000011_EventStoringError"],
    `error occured during event storing`,
    {
      event,
      innerError: error,
    },
  );

export const PublishUnmatchedEventTypeException = (event: IEvent, service: string) =>
  createException(Constants["000020_PublishUnmatchedEventType"],
    `publish unmatched event: [{ type: ${event.type}, name: ${event.name} }] in [{ service: ${service} }]`);

export const ConflictedConcurrentEventException = (currentVersion: number, event: IEvent) =>
  createException(
    Constants["000100_ConflictedConcurrentEvent"],
    `apply a conflicted event: [{ version: ${event._version} }] to [{ currentVersion: ${currentVersion} }]`,
    {
      currentVersion,
      event,
    },
  );
