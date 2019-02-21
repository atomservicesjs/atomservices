import { ICommand, ICommandHandler } from "atomservicescore";

export interface ICommandHandlers {
  type: () => string;
  resolve: <CommandPayloads = any, EventPayloads = any, CreatedBy = any>(
    command: ICommand<CommandPayloads, CreatedBy>,
  ) => ICommandHandler<CommandPayloads, EventPayloads> | undefined;
  forEach: (callback: (handler: ICommandHandler) => void) => number;
}
