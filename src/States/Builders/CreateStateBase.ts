import { IEvent, IState } from "atomservicescore";

export const CreateStateBase = <State extends IState>(event: IEvent): State =>
  Object.defineProperties({}, {
    _id: {
      configurable: false,
      enumerable: true,
      value: event.aggregateID,
      writable: false,
    },

    _createdAt: {
      configurable: false,
      enumerable: true,
      value: event._createdAt,
      writable: false,
    },
    _createdBy: {
      configurable: false,
      enumerable: true,
      value: event._createdBy,
      writable: false,
    },
    _updatedAt: {
      configurable: false,
      enumerable: true,
      value: event._createdAt,
      writable: false,
    },
    _updatedBy: {
      configurable: false,
      enumerable: true,
      value: event._createdBy,
      writable: false,
    },
    _version: {
      configurable: false,
      enumerable: true,
      value: event._version,
      writable: false,
    },
  });
