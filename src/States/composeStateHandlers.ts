import { IStateHandler } from "atomservicescore";
import { ComposeDuplicatedStateHandlersException } from "../Exceptions/Core";
import { IStateHandlers } from "./IStateHandlers";

interface IStateHandlersMap {
  [name: string]: IStateHandler;
}

export const composeStateHandlers = (...stateHandlers: IStateHandler[]) =>
  (type: string): IStateHandlers =>
    ((StateHandlers: IStateHandler[]): IStateHandlers => {
      const HANDLERS_MAP = StateHandlers.reduce((result: IStateHandlersMap, handler) => {
        const { name } = handler;

        if (result[name] === undefined) {
          result[name] = handler;
        } else {
          throw ComposeDuplicatedStateHandlersException(type, name);
        }

        return result;
      }, {} as IStateHandlersMap);

      const HANDLERS: IStateHandlers = {
        apply: async (events) => {
          for (const event of events) {
            const handler = HANDLERS_MAP[event.name];
            await handler.apply(event);
          }
        },
        resolve: (event) =>
          HANDLERS_MAP[event.name],
        type: () =>
          type,
      };

      Object.freeze(HANDLERS);

      return HANDLERS;
    })(stateHandlers);

Object.freeze(composeStateHandlers);
