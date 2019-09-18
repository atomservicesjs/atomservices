import { ICommandHandler, IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IService, IServiceConfigs } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { DefaultConnectStream } from "./core/DefaultConnectStream";
import { IConnectStream } from "./core/IConnectStream";

export const createService = (
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
  enhancers: {
    EventStores?: IEventStores,
    ConnectStream?: IConnectStream;
  } = {},
) => (
  components: {
    CommandHandlers?: ICommandHandler[];
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  } = {},
  ): IService => ((Identifier, EventStream, Configs, Enhancers, Components): IService => {
    const {
      CommandHandlers = [],
      EventHandlers = [],
      Reactions = [],
    } = Components;
    const Scope = Configs.scope;
    const Type = Configs.type;
    const {
      ConnectStream = DefaultConnectStream,
      EventStores,
    } = Enhancers;
    const CommandDispatcher = composeCommandDispatcher(Identifier, EventStream, EventStores)(Configs, ...CommandHandlers);

    const Service: IService = {
      configs: () =>
        Configs,
      connect: async () =>
        ConnectStream(
          Scope,
          Identifier,
          EventStream,
          Configs,
          {
            EventHandlers,
            Reactions,
          },
          {
            EventStores,
          },
        ),
      dispatch: async (command, listening) =>
        CommandDispatcher.dispatch(command, listening),
      scope: () =>
        Scope,
      type: () =>
        Type,
    };

    Object.freeze(Service);

    return Service;
  })(identifier, stream, configs, enhancers, components);

Object.freeze(createService);
