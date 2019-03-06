import { ICommand, IServiceContext, Services, StateQueryResultListener } from "atomservicescore";
import { ICommandHandlers } from "../../Commands/ICommandHandlers";
import { DispatchResult } from "../DispatchResult";

export const createCommandDispatch = (
  CommandHandlers: ICommandHandlers,
  ServiceContext: IServiceContext,
) => (command: ICommand, listener?: StateQueryResultListener): Services.DispatchResultType => {
    const type = CommandHandlers.type();
    const handler = CommandHandlers.resolve(command);

    if (handler === undefined) {
      const { name } = command;

      return DispatchResult.unhandled(type, name);
    } else {
      const validationResult = handler.validate(command.payloads);

      if (!validationResult.isValid) {
        const { invalidAttributes } = validationResult;

        return DispatchResult.invalid(invalidAttributes);
      } else {
        const event = handler.transform(command, type, ServiceContext);

        if (listener !== undefined) {
          ServiceContext.listenTo(event._id, listener);
        }

        ServiceContext.dispatch(event);

        return DispatchResult.accept(event._id);
      }
    }
  };

Object.freeze(createCommandDispatch);
