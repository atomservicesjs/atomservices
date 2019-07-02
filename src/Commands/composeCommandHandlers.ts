import { ICommandHandler } from "atomservicescore";
import { ComposeDuplicatedCommandHandlersException } from "../Exceptions/Core";
import { ICommandHandlers } from "./ICommandHandlers";

interface ICommandHandlersMap {
  [name: string]: ICommandHandler;
}

export const composeCommandHandlers = (...commandHandlers: ICommandHandler[]) =>
  (type: string): ICommandHandlers =>
    ((CommandHandlers: ICommandHandler[]): ICommandHandlers => {
      const HANDLERS_MAP = CommandHandlers.reduce((result: ICommandHandlersMap, handler) => {
        const { name } = handler;

        if (result[name] === undefined) {
          result[name] = handler;
        } else {
          throw ComposeDuplicatedCommandHandlersException(type, name);
        }

        return result;
      }, {} as ICommandHandlersMap);

      const Handlers: ICommandHandlers = {
        forEach: (callback) => {
          const keys = Object.keys(HANDLERS_MAP);

          for (const name of keys) {
            callback(HANDLERS_MAP[name]);
          }

          return keys.length;
        },
        resolve: (command) => HANDLERS_MAP[command.name],
        type: () => type,
      };

      Object.freeze(Handlers);

      return Handlers;
    })(commandHandlers);

Object.freeze(composeCommandHandlers);
