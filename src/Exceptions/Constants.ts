/* [123456]
 * [12] - 00: This Library Scoped
 * [34] - 00: Components
 *        01: Process
 * [56] - Running Exceptions
 */

export const CombineDuplicatedCommandHandlers = "CombineDuplicatedCommandHandlers";
export const CombineDuplicatedEventHandlers = "CombineDuplicatedEventHandlers";
export const CombineDuplicatedQueryHandlers = "CombineDuplicatedQueryHandlers";
export const CurrentVersionQueryingError = "CurrentVersionQueryingError";
export const EventStoringError = "EventStoringError";
export const EventPublishingError = "EventPublishingError";
export const EventVersionConflictedConcurrent = "EventVersionConflictedConcurrent";

export default {
  "000001_CombineDuplicatedCommandHandlers": { code: "000001", name: CombineDuplicatedCommandHandlers },
  "000002_CombineDuplicatedEventHandlers": { code: "000002", name: CombineDuplicatedEventHandlers },
  "000003_CombineDuplicatedQueryHandlers": { code: "000003", name: CombineDuplicatedQueryHandlers },
  "000010_CurrentVersionQueryingError": { code: "000010", name: CurrentVersionQueryingError },
  "000011_EventStoringError": { code: "000011", name: EventStoringError },
  "000012_EventPublishingError": { code: "000012", name: EventPublishingError },
  "000100_EventVersionConflictedConcurrent": { code: "000100", name: EventVersionConflictedConcurrent },
};
