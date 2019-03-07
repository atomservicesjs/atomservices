import { IQuery } from "atomservicescore";

export const QueryBuilder = <Payloads = any>(
  initial: {
    name: string;
  },
  payloads?: Payloads,
): IQuery => {
  let query = Object.defineProperty({}, "name", {
    configurable: false,
    enumerable: true,
    value: initial.name,
    writable: false,
  });

  if (payloads) {
    query = Object.defineProperty(query, "payloads", {
      configurable: false,
      enumerable: true,
      value: payloads,
      writable: false,
    });
  }

  return query;
};
