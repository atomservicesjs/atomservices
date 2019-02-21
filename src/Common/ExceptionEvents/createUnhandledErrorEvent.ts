import { IEvent } from "atomservicescore";

export const createUnhandledErrorEvent = (originalEvent: IEvent, error: Error, currentVersion: number): IEvent => {
  const { _createdAt, _createdBy, _id, _version, aggregateID, name, payloads, type } = originalEvent;

  return {
    _createdAt: new Date(),
    _createdBy,
    _id,
    _version: currentVersion + 1,
    aggregateID,
    name: "_UnhandledError",
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
