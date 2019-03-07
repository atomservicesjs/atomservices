import { IEvent } from "atomservicescore";
import { Compose } from "../../Common/Compose";

export const EventBuilder = (compose: Compose) => <Payloads = any, EventID = any, AggregateID = any, CreatedBy = any>(
  initial: {
    id: EventID;
    name: string;
    aggregateID: AggregateID;
    version: number;
    createdBy?: CreatedBy;
  },
  payloads?: Payloads,
): IEvent<EventID, AggregateID> => {
  let event: any = {
    _createdAt: new Date(),
  };

  event = Object.defineProperties(compose(event), {
    _id: {
      configurable: false,
      enumerable: true,
      value: initial.id,
      writable: false,
    },
    _version: {
      configurable: false,
      enumerable: true,
      value: initial.version,
      writable: false,
    },
    aggregateID: {
      configurable: false,
      enumerable: true,
      value: initial.aggregateID,
      writable: false,
    },
    name: {
      configurable: false,
      enumerable: true,
      value: initial.name,
      writable: false,
    },
  });

  if (initial.createdBy) {
    event = Object.defineProperty(event, "_createdBy", {
      configurable: false,
      enumerable: true,
      value: initial.createdBy,
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
