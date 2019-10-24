import { IAtomEvent, IAtomState } from "atomservicescore";

export const UpdateStateBase = (event: IAtomEvent, state: IAtomState): IAtomState =>
  Object.defineProperties({}, {
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
