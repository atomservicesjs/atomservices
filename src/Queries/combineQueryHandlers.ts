import { IQueryHandler } from "atomservicescore";
import { CombineDuplicatedQueryHandlersException } from "../Exceptions/Core";
import { IQueryHandlers } from "./IQueryHandlers";

interface IQueryHandlersMap {
  [name: string]: IQueryHandler;
}

export const combineQueryHandlers = (...queryHandlers: IQueryHandler[]) =>
  (type: string): IQueryHandlers =>
    ((QueryHandlers: IQueryHandler[]): IQueryHandlers => {
      const HandlersMap = QueryHandlers.reduce((result: IQueryHandlersMap, handler) => {
        const { name } = handler;

        if (result[name] === undefined) {
          result[name] = handler;
        } else {
          throw CombineDuplicatedQueryHandlersException(type, name);
        }

        return result;
      }, {} as IQueryHandlersMap);

      return {
        forEach: (callback) => {
          const keys = Object.keys(HandlersMap);
          keys.forEach((name) => callback(HandlersMap[name]));

          return keys.length;
        },
        resolve: (query) => HandlersMap[query.name],
        type: () => type,
      };
    })(queryHandlers);

Object.freeze(combineQueryHandlers);
