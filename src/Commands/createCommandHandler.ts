import { CommandHandler, ICommandHandler } from "atomservicescore";

export const createCommandHandler = <CommandPayloads = any, EventPayloads = any>(
  name: string,
  validate: CommandHandler.CommandValidate<CommandPayloads>,
  transform: CommandHandler.CommandTransform<CommandPayloads, EventPayloads>,
): ICommandHandler<CommandPayloads, EventPayloads> => {
  const handler: ICommandHandler<CommandPayloads, EventPayloads> = Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: name,
      writable: false,
    },
    transform: {
      configurable: false,
      enumerable: true,
      value: transform,
      writable: false,
    },
    validate: {
      configurable: false,
      enumerable: true,
      value: validate,
      writable: false,
    },
  });

  return handler;
};

Object.freeze(createCommandHandler);
