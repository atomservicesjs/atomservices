import { IQueryHandler, QueryHandler } from "atomservicescore";

export const createQueryHandler = <Payloads = any, QueryResult = any>(
  name: string,
  validate: QueryHandler.QueryValidate<Payloads>,
  query: QueryHandler.Querying<Payloads, QueryResult>,
): IQueryHandler<Payloads, QueryResult> => {
  const handler: IQueryHandler<Payloads, QueryResult> = Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: name,
      writable: false,
    },
    query: {
      configurable: false,
      enumerable: true,
      value: query,
      writable: false,
    },
    validate: {
      configurable: false,
      enumerable: true,
      value: validate,
      writable: false,
    },
  });

  return handler;
};

Object.freeze(createQueryHandler);
