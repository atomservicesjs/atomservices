/* [123456]
 * [12] - 00: This Library Scoped
 * [34] - 00: Components
 *        01: Process
 * [56] - Running Exceptions
 */

export const ComposeDuplicatedCommandHandlers = "ComposeDuplicatedCommandHandlers";
export const ComposeDuplicatedEventHandlers = "ComposeDuplicatedEventHandlers";
export const ComposeDuplicatedStateHandlers = "ComposeDuplicatedStateHandlers";
export const CombineDuplicatedCommandDispatchers = "CombineDuplicatedCommandDispatchers";
export const CombineInvalidScopeCommandDispatchers = "CombineInvalidScopeCommandDispatchers";
export const EventVersionConflictedConcurrent = "EventVersionConflictedConcurrent";
export const CurrentVersionQueryingError = "CurrentVersionQueryingError";
export const EventStoringError = "EventStoringError";
export const EventPublishingError = "EventPublishingError";
export const NoAllowedDynamicVersionError = "NoAllowedDynamicVersionError";
export const NoEventStoresProvided = "NoEventStoresProvided";

export default {
  "000001_ComposeDuplicatedCommandHandlers": { code: "000001", name: ComposeDuplicatedCommandHandlers },
  "000002_ComposeDuplicatedEventHandlers": { code: "000002", name: ComposeDuplicatedEventHandlers },
  "000003_ComposeDuplicatedStateHandlers": { code: "000003", name: ComposeDuplicatedStateHandlers },
  "000004_CombineDuplicatedCommandDispatchers": { code: "000004", name: CombineDuplicatedCommandDispatchers },
  "000005_CombineInvalidScopeCommandDispatchers": { code: "000005", name: CombineInvalidScopeCommandDispatchers },
  "000100_EventVersionConflictedConcurrent": { code: "000100", name: EventVersionConflictedConcurrent },
  "000101_CurrentVersionQueryingError": { code: "000101", name: CurrentVersionQueryingError },
  "000102_EventStoringError": { code: "000102", name: EventStoringError },
  "000103_EventPublishingError": { code: "000103", name: EventPublishingError },
  "000108_NoAllowedDynamicVersionError": { code: "000108", name: NoAllowedDynamicVersionError },
  "000110_NoEventStoresProvided": { code: "000110", name: NoEventStoresProvided },
};
