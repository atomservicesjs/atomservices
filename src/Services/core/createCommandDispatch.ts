import { ICommand, IServiceContext, Services, StateQueryResultListener } from "atomservicescore";
import { ICommandHandlers } from "../../Commands/ICommandHandlers";
import { DispatchResult } from "../DispatchResult";

export const createCommandDispatch = (commandHandlers: ICommandHandlers, context: IServiceContext) =>
  (command: ICommand, listener?: StateQueryResultListener): Services.DispatchResultType => {
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
          context.listenTo(event._id, listener);
        }

        context.dispatch(event);

        return DispatchResult.accept(event._id);
      }
    }
  };

Object.freeze(createCommandDispatch);
