import { IEvent } from "atomservicescore";
import { Compose } from "../../Common/Compose";

export const EventTransformer = (compose: Compose) => <
  Event extends IEvent = IEvent,
  Payloads = any,
  EventID = any,
  AggregateID = any,
  CreatedBy = any,
  >(
    initial: {
      aggregateID: AggregateID;
      id: EventID;
      name: string;
      version: number;
    },
    options: {
      _createdBy?: CreatedBy;
    },
    payloads?: Payloads,
): Event => {
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

  if (options._createdBy) {
    event = Object.defineProperty(event, "_createdBy", {
      configurable: false,
      enumerable: true,
      value: options._createdBy,
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
