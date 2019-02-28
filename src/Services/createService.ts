import { IContainer, IService, IServiceConfigs, IServiceContext, IStateBase, ServiceBootstrap } from "atomservicescore";
import { ICommandHandlers } from "../Commands/ICommandHandlers";
import { IEventHandlers } from "../Events/IEventHandlers";
import { IStateRepository } from "../IStateRepository";
import { IQueryHandlers } from "../Queries/IQueryHandlers";
import { IReactions } from "../Reactions/IReactions";
import { createCommandDispatch } from "./core/createCommandDispatch";
import { createEventProcess } from "./core/createEventProcess";
import { createQuerier } from "./core/createQuerier";
import { createReactor } from "./core/createReactor";

export const createService = <State extends IStateBase>(
  name: string,
  components: {
    composeCommandHandlers: (type: string) => ICommandHandlers;
    composeEventHandlers: (type: string) => IEventHandlers;
    composeQueryHandlers: (type: string) => IQueryHandlers;
    composeReactions: (type: string) => IReactions;
    repository: IStateRepository<State>;
  },
  configs?: IServiceConfigs,
): ServiceBootstrap => (bootstraper) =>
    (async (
      ServiceName,
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
      const CommandHandlers = composeCommandHandlers(ServiceName);
      const EventHandlers = composeEventHandlers(ServiceName);
      const QueryHandlers = composeQueryHandlers(ServiceName);
      const Reactions = composeReactions(ServiceName);
      const ServiceContext: IServiceContext = Bootstraper.provide(ServiceName, configs);

      const dispatch = createCommandDispatch(CommandHandlers, ServiceContext);
      const process = createEventProcess(EventHandlers, Repository, ServiceContext);
      const querier = createQuerier(QueryHandlers, ServiceContext);
      const reactor = createReactor(Reactions, ServiceContext);

      const psHandlers: Array<Promise<void>> = [];
      const psReactions: Array<Promise<void>> = [];

      EventHandlers.forEach((handler) => {
        psHandlers.push(ServiceContext.registerHandler(handler, process));
      });

      Reactions.forEach((reaction) => {
        psReactions.push(ServiceContext.registerReaction(reaction, reactor));
      });

      await Promise.all(psHandlers);
      await Promise.all(psReactions);

      const service: IService = {
        configs: () => Configs,
        dispatch: (command, listener) => dispatch(command, listener),
        name: () => ServiceName,
        query: (query, listener) => querier(query, listener),
      };

      if ((Bootstraper as IContainer).registerService !== undefined) {
        (Bootstraper as IContainer).registerService(service);
      }

      return service;
    })(name, components, bootstraper, configs);
