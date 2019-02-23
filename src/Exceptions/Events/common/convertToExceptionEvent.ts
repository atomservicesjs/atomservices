import { IEvent } from "atomservicescore";

export const convertToExceptionEvent = (name: string, event: IEvent, error: any): IEvent => ({
  _createdAt: new Date(),
  _createdBy: event._createdBy,
  _id: event._id,
  _version: event._version,
  aggregateID: event.aggregateID,
  name: `_${name}`,
  payloads: {
    error: {
      code: error.code,
      message: error.message,
      name: error.name,
    },
    event: {
      _createdAt: event._createdAt,
      _version: event._version,
      name: event.name,
      payloads: event.payloads,
      type: event.type,
    },
  },
  type: "exceptions",
});
