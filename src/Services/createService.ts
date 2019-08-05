import { ICommandHandler, IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IService, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { ServiceEventStreamFactory } from "../Context/Factories/ServiceEventStreamFactory";
import { NoBoundCommandHandlersServiceException } from "../Exceptions/Core";
import { composeEventProcessor } from "./core/composeEventProcessor";
import { composeEventReactor } from "./core/composeEventReactor";
import { ConnectOpt, DefaultConnectOpt } from "./core/ConnectOpt";

export const createService = (
  container: IServiceContainer,
  stream: IEventStream,
  identifier: IIdentifier,
  configs: IServiceConfigs,
  options: {
    EventStores?: IEventStores,
  } = {},
) => (
  components: {
    CommandHandlers?: ICommandHandler[];
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  } = {},
  opts: {
    connectOpt?: ConnectOpt;
  } = {},
  ): IService => ((Container, Identifier, EventStream, Configs, Components, Opts, Options): IService => {
    const {
      CommandHandlers = [],
      EventHandlers = [],
      Reactions = [],
    } = Components;
    const CommandDispatcher = composeCommandDispatcher(Container, Identifier, EventStream, Options)(Configs, ...CommandHandlers);
    const EventProcessor = composeEventProcessor(Container, Identifier, EventStream)(Configs, ...EventHandlers);
    const EventReactor = composeEventReactor(Container, Identifier, EventStream)(Configs, ...Reactions);
    const ServiceEventStream = ServiceEventStreamFactory.create(EventStream, Container.scope(), Configs.type, Configs);
    const { connectOpt = DefaultConnectOpt } = Opts;

    const Service: IService = {
      configs: () =>
        Configs,
      connect: async () => connectOpt({
        EventHandlers,
        EventProcessor,
        EventReactor,
        Reactions,
        ServiceEventStream,
      }),
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
  })(container, identifier, stream, configs, components, opts, options);

Object.freeze(createService);
