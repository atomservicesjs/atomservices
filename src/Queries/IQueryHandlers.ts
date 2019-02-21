import { IQuery, IQueryHandler } from "atomservicescore";

export interface IQueryHandlers {
  type: () => string;
  resolve: <Payloads = any, QueryResult = any>(
    query: IQuery<Payloads>,
  ) => IQueryHandler<Payloads, QueryResult> | undefined;
  forEach: (callback: (handler: IQueryHandler) => void) => number;
}
