import { IEvent } from "atomservicescore";

export const convertToExceptionEvent = (eventName: string, event: IEvent, error: any): IEvent => {
  const { _createdAt, _createdBy, _id, _version, aggregateID, name, payloads, type } = event;

  return {
    _createdAt: new Date(),
    _createdBy,
    _id,
    _version,
    aggregateID,
    name: `_${eventName}`,
    payloads: {
      error: {
        code: error.code,
        message: error.message,
        name: error.name,
      },
      event: {
        _createdAt,
        _version,
        name,
        payloads,
        type,
      },
    },
    type: "exceptions",
  };
};
