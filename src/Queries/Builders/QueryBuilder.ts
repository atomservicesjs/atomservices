import { IQuery } from "atomservicescore";

export const QueryBuilder = <Payloads = any>(
  initial: {
    name: string;
  },
  payloads: Payloads,
): IQuery<Payloads> =>
  Object.defineProperties({}, {
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
