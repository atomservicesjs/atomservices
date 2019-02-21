import { ICommand } from "atomservicescore";

export const CommandBuilder = <Payloads = any>(
  initial: {
    name: string;
    version: number;
    createdBy: any;
  },
  payloads: Payloads,
): ICommand<Payloads> =>
  Object.defineProperties({}, {
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
    _version: {
      configurable: false,
      enumerable: true,
      value: initial.version,
      writable: false,
    },
    name: {
      configurable: false,
      enumerable: true,
      value: initial.name,
      writable: false,
    },
    payloads: {
      configurable: false,
      enumerable: true,
      value: payloads,
      writable: false,
    },
  });
