import { IEvent } from "atomservicescore";
import Constants from "./Constants";
import { createException } from "./createException";

export const ComposeDuplicatedCommandHandlersException = (type: string, name: string) =>
  createException(Constants["000001_ComposeDuplicatedCommandHandlers"], `compose duplicated command handlers - { type: '${type}', name: '${name}' }`);

export const ComposeDuplicatedEventHandlersException = (type: string, name: string) =>
  createException(Constants["000002_ComposeDuplicatedEventHandlers"], `compose duplicated event handlers - { type: '${type}', name: '${name}' }`);

export const CombineDuplicatedCommandDispatcherException = (type: string) =>
  createException(Constants["000004_CombineDuplicatedCommandDispatchers"], `combine duplicated command dispatchers - { type: '${type}' }`);

export const CombineInvalidScopeCommandDispatcherException = (scope: string) =>
  createException(Constants["000005_CombineInvalidScopeCommandDispatchers"], `combine invalid scope command dispatchers - { scope: '${scope}' }`);

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

export const NoBoundCommandHandlersServiceException = (scope: string, type: string) =>
  createException(Constants["000051_NoBoundCommandHandlersService"], `no bound command handlers service - { scope: '${scope}', type: '${type} }`);

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
