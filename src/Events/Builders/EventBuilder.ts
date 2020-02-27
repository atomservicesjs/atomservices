import { IEvent } from "atomservicescore";

export const EventBuilder = <
  Payloads = any,
  EventID = any,
  AggregateID = any,
  CreatedBy = any,
  >(
    composed: {
      id: EventID;
      type: string;
      name: string;
      aggregateID: AggregateID;
      version: number;
      createdBy?: CreatedBy;
    },
    payloads?: Payloads,
): IEvent<EventID, AggregateID> => {
  let event = Object.defineProperties({}, {
    _id: {
      configurable: false,
      enumerable: true,
      value: composed.id,
      writable: false,
    },

    _createdAt: {
      configurable: false,
      enumerable: true,
      value: new Date(),
      writable: false,
    },
    _version: {
      configurable: false,
      enumerable: true,
      value: composed.version,
      writable: false,
    },
    aggregateID: {
      configurable: false,
      enumerable: true,
      value: composed.aggregateID,
      writable: false,
    },
    name: {
      configurable: false,
      enumerable: true,
      value: composed.name,
      writable: false,
    },
    type: {
      configurable: false,
      enumerable: true,
      value: composed.type,
      writable: false,
    },
  });

  if (composed.createdBy) {
    event = Object.defineProperty(event, "_createdBy", {
      configurable: false,
      enumerable: true,
      value: composed.createdBy,
      writable: false,
    });
  }

  if (payloads) {
    event = Object.defineProperty(event, "payloads", {
      configurable: false,
      enumerable: true,
      value: payloads,
      writable: false,
    });
  }

  return event;
};
