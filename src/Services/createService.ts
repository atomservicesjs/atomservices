import { ICommandHandler, IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IService, IServiceConfigs } from "atomservicescore";
import { composeCommandDispatcher } from "../Commands/composeCommandDispatcher";
import { UUIDIdentifier } from "../Identifiers/UUIDIdentifier";
import { DefaultConnectStream } from "./core/DefaultConnectStream";
import { IConnectStream } from "./core/IConnectStream";

export const createService = (
  stream: IEventStream,
  configs: IServiceConfigs,
  enhancers: {
    EventStores?: IEventStores;
    Identifier?: IIdentifier;
    ConnectStream?: IConnectStream;
  } = {},
) => (
  components: {
    CommandHandlers?: ICommandHandler[];
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  } = {},
  ): IService => ((EventStream, Configs, Enhancers, Components): IService => {
    const {
      CommandHandlers = [],
      EventHandlers = [],
      Reactions = [],
    } = Components;
    const Scope = Configs.scope;
    const Type = Configs.type;
    const {
      ConnectStream = DefaultConnectStream,
      Identifier = UUIDIdentifier,
      EventStores,
    } = Enhancers;
    const CommandDispatcher = composeCommandDispatcher(Identifier, EventStream, EventStores)(Configs, ...CommandHandlers);

    const Service: IService = {
      configs: () =>
        Configs,
      connect: async () =>
        ConnectStream(
          Scope,
          EventStream,
          Configs,
          {
            EventHandlers,
            Reactions,
          },
          {
            EventStores,
            Identifier,
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
  })(stream, configs, enhancers, components);

Object.freeze(createService);
