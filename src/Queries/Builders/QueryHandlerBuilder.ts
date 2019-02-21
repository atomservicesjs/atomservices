import { IQueryHandler, Queries } from "atomservicescore";

export const QueryHandlerBuilder = <Payloads, QueryResult>(
  initial: {
    name: string;
    validate: Queries.QueryValidate<Payloads>
    query: Queries.Querying<Payloads, QueryResult>;
  },
): IQueryHandler<Payloads> =>
  Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: initial.name,
      writable: false,
    },
    query: {
      configurable: false,
      enumerable: true,
      value: initial.query,
      writable: false,
    },
    validate: {
      configurable: false,
      enumerable: true,
      value: initial.validate,
      writable: false,
    },
  });
