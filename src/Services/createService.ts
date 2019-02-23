import { IContainer, IContextProvider, IService, IServiceConfigs, IServiceContext, IStateBase } from "atomservicescore";
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
) => (boostraper: IContextProvider | IContainer): IService =>
    ((
      ServiceName,
      {
        composeCommandHandlers,
        composeEventHandlers,
        composeQueryHandlers,
        composeReactions,
        repository: Repository,
      },
      Boostraper,
      Configs = {},
    ): IService => {
      const CommandHandlers = composeCommandHandlers(ServiceName);
      const EventHandlers = composeEventHandlers(ServiceName);
      const QueryHandlers = composeQueryHandlers(ServiceName);
      const Reactions = composeReactions(ServiceName);
      const ServiceContext: IServiceContext = Boostraper.provide(ServiceName, configs);

      const dispatch = createCommandDispatch(CommandHandlers, ServiceContext);
      const process = createEventProcess(EventHandlers, Repository, ServiceContext);
      const querier = createQuerier(QueryHandlers, ServiceContext);
      const reactor = createReactor(Reactions, ServiceContext);

      EventHandlers.forEach((handler) => ServiceContext.registerHandler(handler, process));
      Reactions.forEach((reaction) => ServiceContext.registerReaction(reaction, reactor));

      const service: IService = {
        configs: () => Configs,
        dispatch: (command, listener) => dispatch(command, listener),
        name: () => ServiceName,
        query: (query, listener) => querier(query, listener),
      };

      if ((Boostraper as IContainer).registerService !== undefined) {
        (Boostraper as IContainer).registerService(service);
      }

      return service;
    })(name, components, boostraper, configs);
