import { ICommandHandler, IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IService, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { NoBoundCommandHandlersServiceException } from "../Exceptions/Core";
import { IStreamConnector } from "./core/IStreamConnector";
import { StreamConnector } from "./core/StreamConnector";

export const createService = (
  container: IServiceContainer,
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
  options: {
    EventStores?: IEventStores,
    Connector?: IStreamConnector;
  } = {},
) => (
  components: {
    CommandHandlers?: ICommandHandler[];
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  } = {},
  ): IService => ((Container, Identifier, EventStream, Configs, Components, Options): IService => {
    const {
      CommandHandlers = [],
      EventHandlers = [],
      Reactions = [],
    } = Components;
    const Type = Configs.type;
    const Scope = Container.scope();
    const {
      Connector = StreamConnector,
      EventStores,
    } = Options;
    const CommandDispatcher = composeCommandDispatcher(Scope, Identifier, EventStream, EventStores)(Configs, ...CommandHandlers);

    const Service: IService = {
      configs: () =>
        Configs,
      connect: async () =>
        Connector.connect(
          Scope,
          Type,
          Configs,
          Identifier,
          EventStream,
          {
            EventHandlers,
            Reactions,
          },
          EventStores,
        ),
      dispatch: async (command, listening) => {
        if (CommandDispatcher) {
          return CommandDispatcher.dispatch(command, listening);
        } else {
          throw NoBoundCommandHandlersServiceException(Scope, Configs.type);
        }
      },
      scope: () =>
        Scope,
      type: () =>
        Configs.type,
    };

    Container.service(Service);
    Object.freeze(Service);

    return Service;
  })(container, identifier, stream, configs, components, options);

Object.freeze(createService);
