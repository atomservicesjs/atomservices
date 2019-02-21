import { IEvent } from "atomservicescore";

export const createConflictedConcurrentEvent = (conflictedEvent: IEvent, currentVersion: number): IEvent => {
  const { _createdAt, _createdBy, _id, _version, aggregateID, name, payloads, type } = conflictedEvent;

  return {
    _createdAt: new Date(),
    _createdBy,
    _id,
    _version: currentVersion + 1,
    aggregateID,
    name: "_ConflictedConcurrentEvent",
    payloads: {
      eventCreatedAt: _createdAt,
      eventName: name,
      eventPayloads: payloads,
      eventVersion: _version,
    },
    type,
  };
};
