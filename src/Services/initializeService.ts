import { EventStreams, IServiceContext, Services } from "atomservicescore";
import { ICommandHandlers } from "../Commands/ICommandHandlers";
import { IEventHandlers } from "../Events/IEventHandlers";
import { IReactions } from "../Reactions/IReactions";

export const initializeService = (
  scope: string,
  type: string,
  components: {
    CommandHandlers: ICommandHandlers;
    EventHandlers: IEventHandlers;
    Reactions: IReactions;
  },
  processes: {
    EventProcess: EventStreams.EventProcess;
    ReactionProcess: EventStreams.EventProcess;
  },
  context: IServiceContext,
) => (async (Scope, Type, Components, Processes, ServiceContext): Promise<{
  asSubscribers: () => Services.IServiceAsSubscribers;
  description: () => Services.IServiceDescription;
}> => {
  const { CommandHandlers, EventHandlers, Reactions } = Components;
  const { EventProcess, ReactionProcess } = Processes;

  const commands: string[] = [];
  const psHandlers: Array<Promise<{
    level: EventStreams.EventLevel;
    scope: string;
    type: string;
    name: string;
  }>> = [];
  const psReactions: Array<Promise<{
    level: EventStreams.EventLevel;
    scope: string;
    type: string;
    name: string;
  }>> = [];

  CommandHandlers.forEach((command) => commands.push(command.name));
  EventHandlers.forEach((handler) => psHandlers.push(ServiceContext.registerHandler(handler, EventProcess)));
  Reactions.forEach((reaction) => psReactions.push(ServiceContext.registerReaction(reaction, ReactionProcess)));

  const handlers = await Promise.all(psHandlers);
  const reactions = await Promise.all(psReactions);

  return {
    asSubscribers: () => {
      const internal = handlers.reduce((result, each) => {
        if (result[each.level] === undefined) {
          result[each.level] = [];
        }

        result[each.level].push(each.name);

        return result;
      }, {} as { [level: string]: string[]; });

      const others = reactions.reduce((result, each) => {
        if (result[each.scope] === undefined) {
          result[each.scope] = {};
        }

        if (result[each.scope][each.type] === undefined) {
          result[each.scope][each.type] = [];
        }

        result[each.scope][each.type].push(each.name);

        return result;
      }, {} as { [scope: string]: { [type: string]: string[]; }; });

      const subscribers: Array<{ scope: string; type: string; level: string; name: string; }> = [];

      Object.keys(internal).forEach((level) =>
        internal[level].forEach((name) => subscribers.push({ scope: Scope, type: Type, level, name })));

      Object.keys(others).forEach((oscope) =>
        Object.keys(others[oscope]).forEach((otype) =>
          others[oscope][otype].forEach((oname) =>
            subscribers.push({ scope: oscope, type: otype, level: "public", name: oname }))));

      const asSubscribers: Services.IServiceAsSubscribers = {
        asSubscribers: [],
        scope: Scope,
        service: Type,
      };

      return asSubscribers;
    },
    description: () => {
      const description: Services.IServiceDescription = {
        commands: [...commands],
        handlers: handlers.map((each) =>
          ({ level: each.level, name: each.name })),
        reactions: reactions.map((each) =>
          ({ scope: each.scope, type: each.type, name: each.name })),
        scope: Scope,
        service: Type,
      };

      return description;
    },
  };
})(scope, type, components, processes, context);
