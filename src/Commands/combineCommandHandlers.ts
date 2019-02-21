import { ICommandHandler } from "atomservicescore";
import { CombineDuplicatedCommandHandlersException } from "../Exceptions/Core";
import { ICommandHandlers } from "./ICommandHandlers";

interface ICommandHandlersMap {
  [name: string]: ICommandHandler;
}

export const combineCommandHandlers = (...commandHandlers: ICommandHandler[]) =>
  (type: string): ICommandHandlers =>
    ((CommandHandlers: ICommandHandler[]): ICommandHandlers => {
      const HandlersMap = CommandHandlers.reduce((result: ICommandHandlersMap, handler) => {
        const { name } = handler;

        if (result[name] === undefined) {
          result[name] = handler;
        } else {
          throw CombineDuplicatedCommandHandlersException(type, name);
        }

        return result;
      }, {} as ICommandHandlersMap);

      return {
        forEach: (callback) => {
          const keys = Object.keys(HandlersMap);
          keys.forEach((name) => callback(HandlersMap[name]));

          return keys.length;
        },
        resolve: (command) => HandlersMap[command.name],
        type: () => type,
      };
    })(commandHandlers);

Object.freeze(combineCommandHandlers);
