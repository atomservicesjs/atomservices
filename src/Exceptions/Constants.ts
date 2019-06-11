/* [123456]
 * [12] - 00: This Library Scoped
 * [34] - 00: Components
 *        01: Process
 * [56] - Running Exceptions
 */

export const ComposeDuplicatedCommandHandlers = "ComposeDuplicatedCommandHandlers";
// export const CombineDuplicatedEventHandlers = "CombineDuplicatedEventHandlers";
// export const CombineDuplicatedQueryHandlers = "CombineDuplicatedQueryHandlers";
export const CombineDuplicatedCommandDispatchers = "CombineDuplicatedCommandDispatchers";
export const CombineInvalidScopeCommandDispatchers = "CombineInvalidScopeCommandDispatchers";
// export const DuplicatedServiceHash = "DuplicatedServiceHash";
// export const CurrentVersionQueryingError = "CurrentVersionQueryingError";
// export const EventStoringError = "EventStoringError";
// export const EventPublishingError = "EventPublishingError";
// export const EventVersionConflictedConcurrent = "EventVersionConflictedConcurrent";

export default {
  "000001_ComposeDuplicatedCommandHandlers": { code: "000001", name: ComposeDuplicatedCommandHandlers },
  // "000002_CombineDuplicatedEventHandlers": { code: "000002", name: CombineDuplicatedEventHandlers },
  // "000003_CombineDuplicatedQueryHandlers": { code: "000003", name: CombineDuplicatedQueryHandlers },
  "000004_CombineDuplicatedCommandDispatchers": { code: "000004", name: CombineDuplicatedCommandDispatchers },
  "000005_CombineInvalidScopeCommandDispatchers": { code: "000005", name: CombineInvalidScopeCommandDispatchers },
  // "000007_DuplicatedServiceHash": { code: "000007", name: DuplicatedServiceHash },
  // "000010_CurrentVersionQueryingError": { code: "000010", name: CurrentVersionQueryingError },
  // "000011_EventStoringError": { code: "000011", name: EventStoringError },
  // "000012_EventPublishingError": { code: "000012", name: EventPublishingError },
  // "000100_EventVersionConflictedConcurrent": { code: "000100", name: EventVersionConflictedConcurrent },
};
