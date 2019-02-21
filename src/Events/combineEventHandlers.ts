import { IEventHandler } from "atomservicescore";
import { CombineDuplicatedEventHandlersException } from "../Exceptions/Core";
import { IEventHandlers } from "./IEventHandlers";

interface IEventHandlersMap {
  [name: string]: IEventHandler;
}

export const combineEventHandlers = (...eventHandlers: IEventHandler[]) =>
  (type: string): IEventHandlers =>
    ((EventHandlers: IEventHandler[]): IEventHandlers => {
      const HandlersMap = EventHandlers.reduce((result: IEventHandlersMap, handler) => {
        const { name } = handler;

        if (result[name] === undefined) {
          result[name] = handler;
        } else {
          throw CombineDuplicatedEventHandlersException(type, name);
        }

        return result;
      }, {} as IEventHandlersMap);

      return {
        forEach: (callback) => {
          const keys = Object.keys(HandlersMap);
          keys.forEach((name) => callback(HandlersMap[name]));

          return keys.length;
        },
        resolve: (event) => HandlersMap[event.name],
        type: () => type,
      };
    })(eventHandlers);

Object.freeze(combineEventHandlers);
