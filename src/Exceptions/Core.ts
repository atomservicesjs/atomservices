import { IEvent } from "atomservicescore";
import Constants from "./Constants";
import { createException } from "./createException";

export const CombineDuplicatedCommandHandlersException = (type: string, name: string) =>
  createException(Constants["000001_CombineDuplicatedCommandHandlers"], `{ type: ${type}, name: ${name} }`);

export const CombineDuplicatedEventHandlersException = (type: string, name: string) =>
  createException(Constants["000002_CombineDuplicatedEventHandlers"], `{ type: ${type}, name: ${name} }`);

export const CombineDuplicatedQueryHandlersException = (type: string, name: string) =>
  createException(Constants["000003_CombineDuplicatedQueryHandlers"], `{ type: ${type}, name: ${name} }`);

export const ResolvedUndefinedEventHandlerException = (type: string, name: string) =>
  createException(Constants["000004_ResolvedUndefinedEventHandler"], `{ type: ${type}, name: ${name} }]`);

export const ConflictedConcurrentEventException = (currentVersion: number, event: IEvent) =>
  createException(
    Constants["000101_ConflictedConcurrentEvent"],
    `try to apply [event: { version: ${event._version} } to { currentVersion: ${currentVersion} }]`,
    {
      currentVersion,
      event,
    },
  );

export const QueryVersionErrorException = (error: Error, type: string, aggregateID: any) =>
  createException(
    Constants["000102_QueryVersionError"],
    `error occuring during querying an event version`,
    {
      innerError: error,
      query: {
        aggregateID,
        type,
      },
    },
  );

export const StoringEventProcessErrorException = (error: Error, event: IEvent) =>
  createException(
    Constants["000103_StoringEventProcessError"],
    `error occuring during storing an event process`,
    {
      event,
      innerError: error,
    },
  );
