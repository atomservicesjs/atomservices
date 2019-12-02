import { IEvent, IState } from "atomservicescore";

export const UpdateStateBase = <State extends IState>(event: IEvent, state: State): State =>
  Object.defineProperties(Object.assign({}, state), {
    _id: {
      configurable: false,
      enumerable: true,
      value: state._id,
      writable: false,
    },

    _createdAt: {
      configurable: false,
      enumerable: true,
      value: state._createdAt,
      writable: false,
    },
    _createdBy: {
      configurable: false,
      enumerable: true,
      value: state._createdBy,
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
