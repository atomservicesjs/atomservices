import { ICommand, IEvent } from "atomservicescore";
import { Compose } from "../../Common/Compose";

export const EventTransformer = <Payloads, EventID = any, AggregateID = any>(
  initial: { id: EventID; aggregateID: AggregateID; payloads: Payloads; },
  command: ICommand,
  eventBase: Compose,
): IEvent<Payloads> =>
  Object.defineProperties(eventBase({}), {
    _createdAt: {
      configurable: false,
      enumerable: true,
      value: command._createdAt,
      writable: false,
    },
    _createdBy: {
      configurable: false,
      enumerable: true,
      value: command._createdBy,
      writable: false,
    },
    _id: {
      configurable: false,
      enumerable: true,
      value: initial.id,
      writable: false,
    },
    _version: {
      configurable: false,
      enumerable: true,
      value: command._version,
      writable: false,
    },
    aggregateID: {
      configurable: false,
      enumerable: true,
      value: initial.aggregateID,
      writable: false,
    },
    payloads: {
      configurable: false,
      enumerable: true,
      value: initial.payloads,
      writable: false,
    },
  });
