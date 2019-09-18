import {
  ICommandHandler,
  IEventStores,
  IEventStream,
  IIdentifier,
  IServiceConfigs,
} from "atomservicescore";
import { isNullOrUndefined } from "util";
import { composeServiceContext } from "../Services/core/composeServiceContext";
import { composeCommandHandlers } from "./composeCommandHandlers";
import { DispatchResult } from "./DispatchResult";
import { ICommandDispatcher } from "./ICommandDispatcher";

export const composeCommandDispatcher = (
  identifier: IIdentifier,
  stream: IEventStream,
  stores?: IEventStores,
) => (
  configs: IServiceConfigs,
  ...commandHandlers: ICommandHandler[]
): ICommandDispatcher => (() => {
  const { scope, type } = configs;
  const CommandHandlers = composeCommandHandlers(...commandHandlers)(type);
  const ServiceContext = composeServiceContext(scope, type, identifier, stream, configs, stores)(false);

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
          // #HOOK: Apply Command Hook
          if (Handler.hook.command) {
            command = await Handler.hook.command(command);
          }

          let event = Handler.transform(command, ServiceContext);

          if (!isNullOrUndefined(listening)) {
            ServiceContext.listenTo(event._id, listening);
          }

          // #HOOK: Apply Event Hook
          if (Handler.hook.event) {
            event = await Handler.hook.event(event);
          }

          await ServiceContext.dispatch(event);

          return DispatchResult.accept(event);
        }
      }
    },
    scope: () => scope,
    type: () => type,
  };

  Object.freeze(DISPATCHER);

  return DISPATCHER;
})();

Object.freeze(composeCommandDispatcher);
