import { IEvent } from "atomservicescore";
import { Compose } from "../../Common/Compose";

export const EventBuilder = <Payloads = any, EventID = any, AggregateID = any, CreatedBy = any>(
  initial: { id: EventID; aggregateID: AggregateID; version: number; createdBy: CreatedBy; },
  payloads: Payloads,
  base: Compose,
): IEvent<Payloads, EventID, AggregateID> =>
  Object.defineProperties(base({}), {
    _createdAt: {
      configurable: false,
      enumerable: true,
      value: new Date(),
      writable: false,
    },
    _createdBy: {
      configurable: false,
      enumerable: true,
      value: initial.createdBy,
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
      value: initial.version,
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
      value: payloads,
      writable: false,
    },
  });
