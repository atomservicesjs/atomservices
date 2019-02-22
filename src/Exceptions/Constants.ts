/* [123456]
 * [12] - 00: This Library Scoped
 * [34] - 00: Components
 *        01: Process
 * [56] - Running Exceptions
 */

export const CombineDuplicatedCommandHandlers = "CombineDuplicatedCommandHandlers";
export const CombineDuplicatedEventHandlers = "CombineDuplicatedEventHandlers";
export const CombineDuplicatedQueryHandlers = "CombineDuplicatedQueryHandlers";
export const QueryCurrentVersionError = "QueryCurrentVersionError";
export const EventStoringError = "EventStoringError";
export const PublishUnmatchedEventType = "PublishUnmatchedEventType";
export const ConflictedConcurrentEvent = "ConflictedConcurrentEvent";

export default {
  "000001_CombineDuplicatedCommandHandlers": { code: "000001", name: CombineDuplicatedCommandHandlers },
  "000002_CombineDuplicatedEventHandlers": { code: "000002", name: CombineDuplicatedEventHandlers },
  "000003_CombineDuplicatedQueryHandlers": { code: "000003", name: CombineDuplicatedQueryHandlers },
  "000010_QueryCurrentVersionError": { code: "000010", name: QueryCurrentVersionError },
  "000011_EventStoringError": { code: "000011", name: EventStoringError },
  "000020_PublishUnmatchedEventType": { code: "000020", name: PublishUnmatchedEventType },
  "000100_ConflictedConcurrentEvent": { code: "000100", name: ConflictedConcurrentEvent },
};
