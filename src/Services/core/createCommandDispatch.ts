import { ICommand, IServiceContext, Services, StateQueryStreamListener } from "atomservicescore";
import { ICommandHandlers } from "../../Commands/ICommandHandlers";
import { DispatchResult } from "../DispatchResult";

export const createCommandDispatch = (commandHandlers: ICommandHandlers, context: IServiceContext) =>
  (command: ICommand, listener?: StateQueryStreamListener): Services.DispatchResultType => {
    const type = commandHandlers.type();
    const handler = commandHandlers.resolve(command);

    if (handler === undefined) {
      const { name } = command;

      return DispatchResult.unhandled(type, name);
    } else {
      const validationResult = handler.validate(command.payloads);

      if (!validationResult.isValid) {
        const { invalidAttributes } = validationResult;

        return DispatchResult.invalid(invalidAttributes);
      } else {
        const event = handler.transform(command, type);

        if (listener !== undefined) {
          context.fromRef(event._id, listener);
        }

        context.publish(event);

        return DispatchResult.accept(event._id);
      }
    }
  };

Object.freeze(createCommandDispatch);
