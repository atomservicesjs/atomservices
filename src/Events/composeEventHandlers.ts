import { IEventHandler } from "atomservicescore";
import { ComposeDuplicatedEventHandlersException } from "../Exceptions/Core";
import { IEventHandlers } from "./IEventHandlers";

interface IEventHandlersMap {
  [name: string]: IEventHandler;
}

export const composeEventHandlers = (...eventHandlers: IEventHandler[]) =>
  (type: string): IEventHandlers =>
    ((EventHandlers: IEventHandler[]): IEventHandlers => {
      const HANDLERS_MAP = EventHandlers.reduce((result: IEventHandlersMap, handler) => {
        const { name } = handler;

        if (result[name] === undefined) {
          result[name] = handler;
        } else {
          throw ComposeDuplicatedEventHandlersException(type, name);
        }

        return result;
      }, {} as IEventHandlersMap);

      const Handlers: IEventHandlers = {
        forEach: (callback) => {
          const keys = Object.keys(HANDLERS_MAP);

          for (const name of keys) {
            callback(HANDLERS_MAP[name]);
          }

          return keys.length;
        },
        resolve: (event) => HANDLERS_MAP[event.name],
        type: () => type,
      };

      Object.freeze(Handlers);

      return Handlers;
    })(eventHandlers);

Object.freeze(composeEventHandlers);
