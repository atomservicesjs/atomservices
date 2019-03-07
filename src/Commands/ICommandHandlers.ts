import { ICommand, ICommandHandler } from "atomservicescore";

export interface ICommandHandlers {
  type: () => string;
  resolve: (command: ICommand) => ICommandHandler | undefined;
  forEach: (callback: (handler: ICommandHandler) => void) => number;
}
