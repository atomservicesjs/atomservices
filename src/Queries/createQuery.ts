import { IQuery } from "atomservicescore";

export const createQuery = <Payloads = any>(
  name: string,
  payloads: Payloads,
): IQuery<Payloads> => {
  const query: IQuery<Payloads> = Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: name,
      writable: false,
    },
    payloads: {
      configurable: false,
      enumerable: true,
      value: payloads,
      writable: false,
    },
  });

  return query;
};

Object.freeze(createQuery);
