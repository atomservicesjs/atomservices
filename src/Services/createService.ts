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
  } = {}): IService => ((Container, Identifier, EventStream, Configs, Components): IService => {
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
      connect: async () => {
        const registes: Array<Promise<any>> = [];

        EventHandlers.forEach((handler) => registes.push(ServiceEventStream.registerEventProcess(handler, EventProcessor.process)));
        Reactions.forEach((reaction) => registes.push(ServiceEventStream.registerEventReact(reaction, EventReactor.react)));

        await Promise.all(registes);
      },
      dispatch: async (command) => {
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

    return Service;
  })(container, identifier, stream, configs, components);

Object.freeze(createService);
