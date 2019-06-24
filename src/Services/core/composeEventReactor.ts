import { IEventStream, IIdentifier, IReaction, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { ServiceContextFactory } from "../../Context/Factories/ServiceContextFactory";
import { composeReactions } from "../../Reactions/composeReactions";
import { IEventReactor } from "./IEventReactor";

export const composeEventReactor = (
  scopeType: string | IServiceContainer,
  identifier: IIdentifier,
  stream: IEventStream,
) => (
  configs: IServiceConfigs,
  ...reactions: IReaction[]
): IEventReactor => ((ScopeType, Identifier, EventStream, Configs, Reactions): IEventReactor => {
  const { type } = Configs;
  const Scope: string = typeof ScopeType === "string" ? ScopeType : ScopeType.scope();
  const EventReactions = composeReactions(...Reactions)(type);
  const ServiceContext = ServiceContextFactory.create(EventStream, Identifier, Scope, type, Configs);

  const reactor: IEventReactor = {
    react: async (event, scope, processAck) => {
      const ps: Array<Promise<any>> = [];
      EventReactions.resolve(event, scope).forEach((each) => ps.push(each.react(event, ServiceContext)));

      await Promise.all(ps);
      await processAck();
    },
  };

  Object.freeze(reactor);

  return reactor;
})(scopeType, identifier, stream, configs, reactions);

Object.freeze(composeEventReactor);
