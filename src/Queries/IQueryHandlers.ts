import { IQuery, IQueryHandler } from "atomservicescore";

export interface IQueryHandlers {
  type: () => string;
  resolve: (query: IQuery) => IQueryHandler | undefined;
  forEach: (callback: (handler: IQueryHandler) => void) => number;
}
