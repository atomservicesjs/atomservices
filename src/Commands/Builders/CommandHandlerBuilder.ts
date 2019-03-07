import { CommandHandler, ICommand, ICommandHandler, IEvent } from "atomservicescore";

export const CommandHandlerBuilder = <
  Command extends ICommand = ICommand,
  Event extends IEvent = IEvent,
  >(
    initial: {
      name: string;
      validate: CommandHandler.CommandValidate<Command>;
      transform: CommandHandler.CommandTransform<Command, Event>;
    },
): ICommandHandler<Command, Event> =>
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
