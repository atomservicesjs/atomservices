import {
  ICommandHandler,
  IEventStream,
  IIdentifier,
  IServiceConfigs,
  IServiceContainer,
  IServiceStateRepository,
  IStateRepositoryProvider,
} from "atomservicescore";
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
  repositoryProvider?: IStateRepositoryProvider,
) => (
  configs: IServiceConfigs,
  ...commandHandlers: ICommandHandler[]
): ICommandDispatcher => (() => {
  const { type } = configs;
  const Scope: string = typeof scopeType === "string" ? scopeType : scopeType.scope();
  const CommandHandlers = composeCommandHandlers(...commandHandlers)(type);
  const ServiceEventStream = ServiceEventStreamFactory.create(stream, Scope, type, configs);
  const ServiceIdentifier = ServiceIdentifierFactory.create(identifier, type);
  const ServiceStateRepository = repositoryProvider ? repositoryProvider.provide(Scope, type) : undefined;

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

          let event = Handler.transform(command, ServiceIdentifier);

          if (ServiceStateRepository) {
            const last = await ServiceStateRepository.queryByAggregateID(event.aggregateID);
          }

          if (!isNullOrUndefined(listening)) {
            ServiceEventStream.listenTo(event._id, listening);
          }

          // #HOOK: Apply Event Hook
          if (Handler.hook.event) {
            event = await Handler.hook.event(event);
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
