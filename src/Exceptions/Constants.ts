/* [123456]
 * [12] - 00: This Library Scoped
 * [34] - 00: Components
 *        01: Process
 * [56] - Running Exceptions
 */

export const CombineDuplicatedCommandHandlers = "CombineDuplicatedCommandHandlers";
export const CombineDuplicatedEventHandlers = "CombineDuplicatedEventHandlers";
export const CombineDuplicatedQueryHandlers = "CombineDuplicatedQueryHandlers";
export const ResolvedUndefinedEventHandler = "ResolvedUndefinedEventHandler";
export const ConflictedConcurrentEvent = "ConflictedConcurrentEvent";
export const QueryVersionError = "QueryVersionError";
export const StoringEventProcessError = "StoringEventProcessError";

export default {
  "000001_CombineDuplicatedCommandHandlers": { code: "000001", name: CombineDuplicatedCommandHandlers },
  "000002_CombineDuplicatedEventHandlers": { code: "000002", name: CombineDuplicatedEventHandlers },
  "000003_CombineDuplicatedQueryHandlers": { code: "000003", name: CombineDuplicatedQueryHandlers },
  "000004_ResolvedUndefinedEventHandler": { code: "000004", name: ResolvedUndefinedEventHandler },
  "000101_ConflictedConcurrentEvent": { code: "000101", name: ConflictedConcurrentEvent },
  "000102_QueryVersionError": { code: "000102", name: QueryVersionError },
  "000103_StoringEventProcessError": { code: "000103", name: StoringEventProcessError },
};
