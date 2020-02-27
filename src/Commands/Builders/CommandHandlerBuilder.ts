import { CommandHandler, ICommand, ICommandHandler, IEvent } from "atomservicescore";

export const CommandHandlerBuilder = <Command extends ICommand = ICommand, Event extends IEvent = IEvent>(
  composed: {
    name: string;
    validate: CommandHandler.CommandValidate<Command>;
    transform: CommandHandler.CommandTransform<Command, Event>;
    hook?: CommandHandler.ICommandHook<Command, Event>;
  },
): ICommandHandler<Command, Event> =>
  Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: composed.name,
      writable: false,
    },
    // tslint:disable-next-line: object-literal-sort-keys
    hook: {
      configurable: false,
      enumerable: true,
      value: composed.hook || {},
      writable: false,
    },
    validate: {
      configurable: false,
      enumerable: true,
      value: composed.validate,
      writable: false,
    },
    transform: {
      configurable: false,
      enumerable: true,
      value: composed.transform,
      writable: false,
    },
  });

Object.freeze(CommandHandlerBuilder);
