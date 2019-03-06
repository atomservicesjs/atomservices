import { IEvent } from "atomservicescore";
import Constants from "./Constants";
import { createException } from "./createException";

export const CombineDuplicatedCommandHandlersException = (type: string, name: string) =>
  createException(Constants["000001_CombineDuplicatedCommandHandlers"], `{ type: ${type}, name: ${name} }`);

export const CombineDuplicatedEventHandlersException = (type: string, name: string) =>
  createException(Constants["000002_CombineDuplicatedEventHandlers"], `{ type: ${type}, name: ${name} }`);

export const CombineDuplicatedQueryHandlersException = (type: string, name: string) =>
  createException(Constants["000003_CombineDuplicatedQueryHandlers"], `{ type: ${type}, name: ${name} }`);

export const DuplicatedServiceHashException = (container: string, service: string) =>
  createException(
    Constants["000007_DuplicatedServiceHash"],
    `{ container: ${container}, service: ${service} }`,
    {
      container,
      service,
    },
  );

export const CurrentVersionQueryingErrorException = (error: Error, aggregateID: any, type: string, scope: string) =>
  createException(
    Constants["000010_CurrentVersionQueryingError"],
    `error occured during current version querying`,
    {
      aggregateID,
      innerError: error,
      scope,
      type,
    },
  );

export const EventStoringErrorException = (error: Error, event: IEvent, scope: string) =>
  createException(
    Constants["000011_EventStoringError"],
    `error occured during event storing`,
    {
      event,
      innerError: error,
      scope,
      type: event.type,
    },
  );

export const EventPublishingErrorException = (error: Error, event: IEvent, scope: string) =>
  createException(
    Constants["000012_EventPublishingError"],
    `error occured during event publishing`,
    {
      event,
      innerError: error,
      scope,
      type: event.type,
    },
  );

export const EventVersionConflictedConcurrentException = (event: IEvent, currentVersion: number, scope: string) =>
  createException(
    Constants["000100_EventVersionConflictedConcurrent"],
    `apply a conflicted event: [{ version: ${event._version} }] to [{ currentVersion: ${currentVersion} }]`,
    {
      currentVersion,
      event,
      scope,
      type: event.type,
    },
  );
