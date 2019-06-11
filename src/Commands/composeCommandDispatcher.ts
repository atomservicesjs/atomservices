import { ICommandHandler, IEventStream, IIdentifier, IServiceConfigs } from "atomservicescore";
import { ServiceEventStreamFactory } from "../Context/Factories/ServiceEventStreamFactory";
import { ServiceIdentifierFactory } from "../Context/Factories/ServiceIdentifierFactory";
import { composeCommandHandlers } from "./composeCommandHandlers";
import { DispatchResult } from "./DispatchResult";
import { ICommandDispatcher } from "./ICommandDispatcher";

export const composeCommandDispatcher = (
  scope: string,
  identifier: IIdentifier,
  stream: IEventStream,
) => (
  type: string,
  configs: IServiceConfigs,
  ...commandHandlers: ICommandHandler[]
): ICommandDispatcher => {
    const CommandHandlers = composeCommandHandlers(...commandHandlers)(type);
    const ServiceEventStream = ServiceEventStreamFactory.create(stream, scope, type, configs);
    const ServiceIdentifier = ServiceIdentifierFactory.create(identifier, type);

    const Dispatcher: ICommandDispatcher = {
      dispatch: async (command) => {
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
            const event = handler.transform(command, ServiceIdentifier);

            await ServiceEventStream.dispatch(event);

            return DispatchResult.accept(event);
          }
        }
      },
      scope: () => scope,
      type: () => type,
    };

    Object.freeze(Dispatcher);

    return Dispatcher;
  };

Object.freeze(composeCommandDispatcher);
