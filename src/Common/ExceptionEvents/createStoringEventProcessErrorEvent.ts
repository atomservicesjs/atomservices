import { IEvent } from "atomservicescore";

export const createStoringEventProcessErrorEvent = (originalEvent: IEvent, error: Error): IEvent => {
  const { _createdAt, _createdBy, _id, _version, aggregateID, name, payloads, type } = originalEvent;

  return {
    _createdAt: new Date(),
    _createdBy,
    _id,
    _version,
    aggregateID,
    name: "_StoringEventProcessErrorEvent",
    payloads: {
      error,
      originalEvent: {
        _createdAt,
        _version,
        name,
        payloads,
        type,
      },
    },
    type,
  };
};
