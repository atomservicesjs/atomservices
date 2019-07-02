import { ICommandHandler, IEventHandler, IEventStream, IIdentifier, IReaction, IService, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { ServiceEventStreamFactory } from "../Context/Factories/ServiceEventStreamFactory";
import { NoBoundCommandHandlersServiceException } from "../Exceptions/Core";
import { composeEventProcessor } from "./core/composeEventProcessor";
import { composeEventReactor } from "./core/composeEventReactor";
import { ConnectOpt, DefaultConnectOpt } from "./core/ConnectOpt";

export const createService = (
  container: IServiceContainer,
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
) => (
  components: {
    CommandHandlers?: ICommandHandler[];
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  } = {},
  opts: {
    connectOpt?: ConnectOpt;
  } = {},
  ): IService => ((Container, Identifier, EventStream, Configs, Components, Opts): IService => {
    const {
      CommandHandlers = [],
      EventHandlers = [],
      Reactions = [],
    } = Components;
    const CommandDispatcher = composeCommandDispatcher(Container, Identifier, EventStream)(Configs, ...CommandHandlers);
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
  })(container, identifier, stream, configs, components, opts);

Object.freeze(createService);
