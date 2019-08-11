import { Core, ICommandHandler, IEventHandler, IReaction, IService, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { NoBoundCommandHandlersServiceException } from "../Exceptions/Core";
import { IStreamConnector } from "./core/IStreamConnector";
import { StreamConnector } from "./core/StreamConnector";

export const createService = (
  container: IServiceContainer,
  identifier: Core.IIdentifier,
  stream: Core.IEventStream,
  configs: IServiceConfigs,
  options: {
    EventStores?: Core.IEventStores,
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
    const Scope = Container.scope();
    const Type = Configs.type;
    const {
      Connector = StreamConnector,
      EventStores,
    } = Options;
    const CommandDispatcher = composeCommandDispatcher(Container.scope(), Identifier, EventStream, EventStores)(Configs, ...CommandHandlers);

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
          throw NoBoundCommandHandlersServiceException(Container.scope(), Configs.type);
        }
      },
      scope: () =>
        Container.scope(),
      type: () =>
        Configs.type,
    };

    Object.freeze(Service);

    return Service;
  })(container, identifier, stream, configs, components, options);

Object.freeze(createService);
