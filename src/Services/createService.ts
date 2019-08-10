import { Core, ICommandHandler, IEventHandler, IReaction, IService, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
// import { ServiceEventStreamFactory } from "../Context/Factories/ServiceEventStreamFactory";
import { NoBoundCommandHandlersServiceException } from "../Exceptions/Core";
// import { composeEventProcessor } from "./core/composeEventProcessor";
// import { composeEventReactor } from "./core/composeEventReactor";
// import { ConnectOpt, DefaultConnectOpt } from "./core/ConnectOpt";
import { IStreamConnector } from "./core/IStreamConnector";
import { StreamConnector } from "./core/StreamConnector";

export const createService = (
  container: IServiceContainer,
  stream: Core.IEventStream,
  identifier: Core.IIdentifier,
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
  ): IService => ((Container, EventStream, Identifier, Configs, Components, Options): IService => {
    const {
      CommandHandlers = [],
      EventHandlers = [],
      Reactions = [],
    } = Components;
    const Scope = Container.scope();
    const Type = Configs.type;
    const CommandDispatcher = composeCommandDispatcher(Container, Identifier, EventStream, Options)(Configs, ...CommandHandlers);

    // const EventProcessor = composeEventProcessor(Container, Identifier, EventStream)(Configs, ...EventHandlers);
    // const EventReactor = composeEventReactor(Container, Identifier, EventStream)(Configs, ...Reactions);
    // const ServiceEventStream = ServiceEventStreamFactory.create(EventStream, Container.scope(), Configs.type, Configs);
    const {
      Connector = StreamConnector,
      EventStores,
    } = Options;

    const Service: IService = {
      configs: () =>
        Configs,
      connect: () => Connector.connect(
        Scope,
        Type,
        Configs,
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
  })(container, stream, identifier, configs, components, options);

Object.freeze(createService);
