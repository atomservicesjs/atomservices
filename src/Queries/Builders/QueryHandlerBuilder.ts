import { IQuery, IQueryHandler, QueryHandler } from "atomservicescore";

export const QueryHandlerBuilder = <Query extends IQuery = IQuery, QueryResult = any>(
  initial: {
    name: string;
    validate: QueryHandler.QueryValidate<Query>
    query: QueryHandler.Querying<Query, QueryResult>;
  },
): IQueryHandler<Query, QueryResult> =>
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
