import { ICommand, ICommandHandler, IEventStream, IIdentifier, IServiceConfigs, Services, StateQueryResultListener } from "atomservicescore";
import { ServiceEventStream, ServiceIdentifier } from "../Context";
import { combineCommandHandlers } from "./combineCommandHandlers";
import { DispatchResult } from "./DispatchResult";
import { ICommandDispatcher } from "./ICommandDispatcher";

export const createCommandDispatcher = (
  scope: string,
  identifier: IIdentifier,
  stream: IEventStream,
) => (
  type: string,
  configs: IServiceConfigs,
  ...commandHandlers: ICommandHandler[]
): ICommandDispatcher => {
    const CommandHandlers = combineCommandHandlers(...commandHandlers)(type);
    const ServiceStream = ServiceEventStream.composeServiceEventStream(stream)(type, scope, configs);
    const Identifier = ServiceIdentifier.composeServiceIdentifier(identifier)(type);

    return {
      dispatch: async (command: ICommand, listener?: StateQueryResultListener): Promise<Services.DispatchResultType> => {
        const handler = CommandHandlers.resolve(command);

        if (handler === undefined) {
          const { name } = command;

          return DispatchResult.unhandled(type, name);
        } else {
          const validationResult = handler.validate(command);

          if (!validationResult.isValid) {
            const { invalidAttributes } = validationResult;

            return DispatchResult.invalid(invalidAttributes);
          } else {
            const event = handler.transform(command, type, Identifier);

            if (listener !== undefined) {
              ServiceStream.listenTo(event._id, listener);
            }

            await ServiceStream.dispatch(event);

            return DispatchResult.accept(event._id);
          }
        }
      },
    };
  };

Object.freeze(createCommandDispatcher);
