import { IService, IServiceConfigs, IServiceContext, IStateBase, Services } from "atomservicescore";
import { ICommandHandlers } from "../Commands/ICommandHandlers";
import { IEventHandlers } from "../Events/IEventHandlers";
import { IStateRepository } from "../IStateRepository";
import { IQueryHandlers } from "../Queries/IQueryHandlers";
import { IReactions } from "../Reactions/IReactions";
import { createCommandDispatch } from "./core/createCommandDispatch";
import { createEventProcess } from "./core/createEventProcess";
import { createQuerier } from "./core/createQuerier";
import { createReactor } from "./core/createReactor";
import { describeService } from "./describeService";

export const createService = <State extends IStateBase>(
  type: string,
  components: {
    composeCommandHandlers: (type: string) => ICommandHandlers;
    composeEventHandlers: (type: string) => IEventHandlers;
    composeQueryHandlers: (type: string) => IQueryHandlers;
    composeReactions: (type: string) => IReactions;
    repository: IStateRepository<State>;
  },
  configs?: IServiceConfigs,
): Services.ServiceBootstrap => (provider) =>
    (async (
      Type,
      {
        composeCommandHandlers,
        composeEventHandlers,
        composeQueryHandlers,
        composeReactions,
        repository: Repository,
      },
      ContextProvider,
      Configs = {},
    ): Promise<IService> => {
      const CommandHandlers = composeCommandHandlers(Type);
      const EventHandlers = composeEventHandlers(Type);
      const QueryHandlers = composeQueryHandlers(Type);
      const Reactions = composeReactions(Type);
      const ServiceContext: IServiceContext = ContextProvider.provide(Type, Configs);

      const dispatch = createCommandDispatch(CommandHandlers, ServiceContext);
      const process = createEventProcess(EventHandlers, Repository, ServiceContext);
      const querier = createQuerier(QueryHandlers, ServiceContext);
      const reactor = createReactor(Reactions, ServiceContext);

      const describe = await describeService(
        ServiceContext.scope(),
        Type,
        {
          CommandHandlers,
          EventHandlers,
          Reactions,
        },
        {
          EventProcess: process,
          ReactionProcess: reactor,
        },
        ServiceContext,
      );

      const service: IService = {
        asSubscribers: () => describe.asSubscribers(),
        configs: () => Configs,
        description: () => describe.description(),
        dispatch: (command, listener) => dispatch(command, listener),
        hash: (container?: string) => Services.ServiceHash.hash(Type, container),
        name: () => Type,
        query: (query, listener) => querier(query, listener),
      };

      return service;
    })(type, components, provider, configs);
