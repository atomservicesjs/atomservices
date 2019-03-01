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

  const handlersMap = handlers.reduce((result, each) => {
    if (result[each.level] === undefined) {
      result[each.level] = [];
    }

    result[each.level].push(each.name);
    result[each.level].sort();

    return result;
  }, {} as { [level: string]: string[]; });

  const reactionsMap = reactions.reduce((result, each) => {
    if (result[each.scope] === undefined) {
      result[each.scope] = {};
    }

    if (result[each.scope][each.type] === undefined) {
      result[each.scope][each.type] = [];
    }

    result[each.scope][each.type].push(each.name);
    result[each.scope][each.type].sort();

    return result;
  }, {} as { [scope: string]: { [type: string]: string[]; }; });

  return {
    asSubscribers: () => {
      const asSubscribers: Array<{ scope: string; type: string; level: string; name: string; }> = [];

      Object.keys(handlersMap).forEach((level) =>
        handlersMap[level].forEach((name) => asSubscribers.push({ scope: Scope, type: Type, level, name })));

      Object.keys(reactionsMap).forEach((oscope) =>
        Object.keys(reactionsMap[oscope]).forEach((otype) =>
          reactionsMap[oscope][otype].forEach((oname) =>
            asSubscribers.push({ scope: oscope, type: otype, level: "public", name: oname }))));

      const subscribers: Services.IServiceAsSubscribers = {
        asSubscribers,
        scope: Scope,
        type: Type,
      };

      return subscribers;
    },
    description: () => {
      const description: Services.IServiceDescription = {
        commands: [...commands],
        handlers: Object.keys(handlersMap).reduce((result, level) => {
          handlersMap[level].forEach((name) => result.push({ level, name }));

          return result;
        }, [] as any[]),
        reactions: Object.keys(reactionsMap).reduce((result, oscope) => {
          Object.keys(reactionsMap[oscope]).forEach((otype) =>
            reactionsMap[oscope][otype].forEach((name) => result.push({ scope: oscope, type: otype, name })));

          return result;
        }, [] as any[]),
        scope: Scope,
        type: Type,
      };

      return description;
    },
  };
})(scope, type, components, processes, context);
