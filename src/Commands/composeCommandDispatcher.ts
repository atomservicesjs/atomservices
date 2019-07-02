import { ICommandHandler, IEventStream, IIdentifier, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { isNullOrUndefined } from "util";
import { ServiceEventStreamFactory } from "../Context/Factories/ServiceEventStreamFactory";
import { ServiceIdentifierFactory } from "../Context/Factories/ServiceIdentifierFactory";
import { composeCommandHandlers } from "./composeCommandHandlers";
import { DispatchResult } from "./DispatchResult";
import { ICommandDispatcher } from "./ICommandDispatcher";

export const composeCommandDispatcher = (
  scopeType: string | IServiceContainer,
  identifier: IIdentifier,
  stream: IEventStream,
) => (
  configs: IServiceConfigs,
  ...commandHandlers: ICommandHandler[]
): ICommandDispatcher => (() => {
  const { type } = configs;
  const Scope: string = typeof scopeType === "string" ? scopeType : scopeType.scope();
  const CommandHandlers = composeCommandHandlers(...commandHandlers)(type);
  const ServiceEventStream = ServiceEventStreamFactory.create(stream, Scope, type, configs);
  const ServiceIdentifier = ServiceIdentifierFactory.create(identifier, type);

  const DISPATCHER: ICommandDispatcher = {
    dispatch: async (command, listening) => {
      const Handler = CommandHandlers.resolve(command);

      if (isNullOrUndefined(Handler)) {
        const { name } = command;

        return DispatchResult.unhandled(type, name);
      } else {
        const validationResult = Handler.validate(command);

        if (!validationResult.isValid) {
          const { invalidAttributes } = validationResult;

          return DispatchResult.invalid(invalidAttributes);
        } else {
          const event = Handler.transform(command, ServiceIdentifier);

          if (!isNullOrUndefined(listening)) {
            ServiceEventStream.listenTo(event._id, listening);
          }

          await ServiceEventStream.dispatch(event);

          return DispatchResult.accept(event);
        }
      }
    },
    scope: () => Scope,
    type: () => type,
  };

  Object.freeze(DISPATCHER);

  return DISPATCHER;
})();

Object.freeze(composeCommandDispatcher);
