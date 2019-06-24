import { ICommandHandler, IEventHandler, IEventStream, IIdentifier, IReaction, IService, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { ServiceEventStreamFactory } from "../Context/Factories/ServiceEventStreamFactory";
import { NoBoundCommandHandlersServiceException } from "../Exceptions/Core";
import { composeEventProcessor } from "./core/composeEventProcessor";
import { composeEventReactor } from "./core/composeEventReactor";

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
  } = {}): Promise<IService> => (async (Container, Identifier, EventStream, Configs, Components): Promise<IService> => {
    const {
      CommandHandlers = [],
      EventHandlers = [],
      Reactions = [],
    } = Components;
    const CommandDispatcher = composeCommandDispatcher(Container, Identifier, EventStream)(Configs, ...CommandHandlers);
    const EventProcessor = composeEventProcessor(Container, Identifier, EventStream)(Configs, ...EventHandlers);
    const EventReactor = composeEventReactor(Container, Identifier, EventStream)(Configs, ...Reactions);
    const ServiceEventStream = ServiceEventStreamFactory.create(EventStream, Container.scope(), Configs.type, Configs);

    const Service: IService = {
      configs: () =>
        Configs,
      dispatch: (command) => {
        if (CommandDispatcher) {
          return CommandDispatcher.dispatch(command);
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

    // ServiceEventStream Register
    const ps: Array<Promise<any>> = [];

    for (const handler of EventHandlers) {
      ps.push(ServiceEventStream.registerHandler(handler, EventProcessor.process));
    }

    for (const reaction of Reactions) {
      ps.push(ServiceEventStream.registerReaction(reaction, EventReactor.react));
    }

    await Promise.all(ps);

    return Service;
  })(container, identifier, stream, configs, components);

Object.freeze(createService);
