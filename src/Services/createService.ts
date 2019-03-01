import { IContainer, IService, IServiceConfigs, IServiceContext, IStateBase, Services } from "atomservicescore";
import { ICommandHandlers } from "../Commands/ICommandHandlers";
import { IEventHandlers } from "../Events/IEventHandlers";
import { IStateRepository } from "../IStateRepository";
import { IQueryHandlers } from "../Queries/IQueryHandlers";
import { IReactions } from "../Reactions/IReactions";
import { createCommandDispatch } from "./core/createCommandDispatch";
import { createEventProcess } from "./core/createEventProcess";
import { createQuerier } from "./core/createQuerier";
import { createReactor } from "./core/createReactor";
import { initializeService } from "./initializeService";

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
): Services.ServiceBootstrap => (bootstraper) =>
    (async (
      Type,
      {
        composeCommandHandlers,
        composeEventHandlers,
        composeQueryHandlers,
        composeReactions,
        repository: Repository,
      },
      Bootstraper,
      Configs = {},
    ): Promise<IService> => {
      const CommandHandlers = composeCommandHandlers(Type);
      const EventHandlers = composeEventHandlers(Type);
      const QueryHandlers = composeQueryHandlers(Type);
      const Reactions = composeReactions(Type);
      const ServiceContext: IServiceContext = Bootstraper.provide(Type, configs);

      const dispatch = createCommandDispatch(CommandHandlers, ServiceContext);
      const process = createEventProcess(EventHandlers, Repository, ServiceContext);
      const querier = createQuerier(QueryHandlers, ServiceContext);
      const reactor = createReactor(Reactions, ServiceContext);

      const initializer = await initializeService(
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
        asSubscribers: () => initializer.asSubscribers(),
        configs: () => Configs,
        description: () => initializer.description(),
        dispatch: (command, listener) => dispatch(command, listener),
        name: () => Type,
        query: (query, listener) => querier(query, listener),
      };

      if ((Bootstraper as IContainer).registerService !== undefined) {
        (Bootstraper as IContainer).registerService(service);
      }

      return service;
    })(type, components, bootstraper, configs);
