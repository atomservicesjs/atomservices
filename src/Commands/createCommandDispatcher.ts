import { ICommand, ICommandHandler, IEventStream, IIdentifier, IServiceConfigs, Services, StateQueryResultListener } from "atomservicescore";
import { ServiceEventStream, ServiceIdentifier } from "../Context";
import { combineCommandHandlers } from "./combineCommandHandlers";
import { DispatchResult } from "./DispatchResult";

export const createCommandDispatcher = (
  identifier: IIdentifier,
  stream: IEventStream,
  ...commandHandlers: ICommandHandler[]
) => (
  type: string,
  scope: string,
  configs?: IServiceConfigs,
  ) => {
    const CommandHandlers = combineCommandHandlers(...commandHandlers)(type);
    const Stream = ServiceEventStream.composeServiceEventStream(stream)(type, scope, configs);
    const Identifier = ServiceIdentifier.composeServiceIdentifier(identifier)(type);

    return {
      dispatch: async (command: ICommand, listener?: StateQueryResultListener): Promise<Services.DispatchResultType> => {
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
            const event = handler.transform(command, type, Identifier);

            if (listener !== undefined) {
              Stream.listenTo(event._id, listener);
            }

            await Stream.dispatch(event);

            return DispatchResult.accept(event._id);
          }
        }
      },
    };
  };

Object.freeze(createCommandDispatcher);
