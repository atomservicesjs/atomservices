import { ICommandHandler, IEventHandler, IEventStream, IIdentifier, IService, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { composeEventProcessor } from "../Events/composeEventProcessor";

export const createService = (
  container: IServiceContainer,
  components: {
    CommandHandlers: ICommandHandler[];
    EventHandlers: IEventHandler[];
  },
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
): IService => ((Container, Components, Identifier, EventStream, Configs): IService => {
  const CommandDispatcher = composeCommandDispatcher(Container.scope(), Identifier, EventStream)(Configs, ...Components.CommandHandlers);

  composeEventProcessor(Container.scope(), Identifier, EventStream)(Configs, ...Components.EventHandlers);

  const Service: IService = {
    configs: () => Configs,
    dispatch: (command) => CommandDispatcher.dispatch(command),
    type: () => Configs.type,
  };

  return Service;
})(container, components, identifier, stream, configs);

Object.freeze(createService);
