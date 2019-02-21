import { IEvent } from "atomservicescore";

export const createQueryVersionErrorEvent = (originalEvent: IEvent, error: Error): IEvent => {
  const { _createdAt, _createdBy, _id, _version, aggregateID, name, payloads, type } = originalEvent;

  return {
    _createdAt: new Date(),
    _createdBy,
    _id,
    _version,
    aggregateID,
    name: "_QueryVersionErrorEvent",
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
