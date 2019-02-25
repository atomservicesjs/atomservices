import { CommandHandler, ICommandHandler } from "atomservicescore";

export const CommandHandlerBuilder = <CommandPayloads = any, EventPayloads = any>(
  initial: {
    name: string;
    validate: CommandHandler.CommandValidate<CommandPayloads>;
    transform: CommandHandler.CommandTransform<CommandPayloads, EventPayloads>;
  },
): ICommandHandler<CommandPayloads, EventPayloads> =>
  Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: initial.name,
      writable: false,
    },
    transform: {
      configurable: false,
      enumerable: true,
      value: initial.transform,
      writable: false,
    },
    validate: {
      configurable: false,
      enumerable: true,
      value: initial.validate,
      writable: false,
    },
  });
