import { IEvent } from "atomservicescore";

export const createEvent = <Payloads = any, EventID = any, AggregateID = any, CreatedBy = any>(
  id: EventID,
  type: string,
  name: string,
  aggregateID: AggregateID,
  payloads: Payloads,
  version: number,
  createdAt: Date,
  createdBy: CreatedBy,
): IEvent<Payloads, EventID, AggregateID, CreatedBy> => {
  const event: IEvent<Payloads, EventID, AggregateID, CreatedBy> = Object.defineProperties({}, {
    _createdAt: {
      configurable: false,
      enumerable: true,
      value: createdAt,
      writable: false,
    },
    _createdBy: {
      configurable: false,
      enumerable: true,
      value: createdBy,
      writable: false,
    },
    _id: {
      configurable: false,
      enumerable: true,
      value: id,
      writable: false,
    },
    _version: {
      configurable: false,
      enumerable: true,
      value: version,
      writable: false,
    },
    aggregateID: {
      configurable: false,
      enumerable: true,
      value: aggregateID,
      writable: false,
    },
    name: {
      configurable: false,
      enumerable: true,
      value: name,
      writable: false,
    },
    payloads: {
      configurable: false,
      enumerable: true,
      value: payloads,
      writable: false,
    },
    type: {
      configurable: false,
      enumerable: true,
      value: type,
      writable: false,
    },
  });

  return event;
};
