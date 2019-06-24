import { IEventHandler, IEventStream, IIdentifier, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { isNullOrUndefined } from "util";
import { ServiceContextFactory } from "../../Context/Factories/ServiceContextFactory";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { EventNames, IEventProcessor } from "./IEventProcessor";

export const composeEventProcessor = (
  scopeType: string | IServiceContainer,
  identifier: IIdentifier,
  stream: IEventStream,
) => (
  configs: IServiceConfigs,
  ...eventHandlers: IEventHandler[]
): IEventProcessor => ((ScopeType, Identifier, EventStream, Configs, Handlers): IEventProcessor => {
  const { type } = Configs;
  const Scope: string = typeof ScopeType === "string" ? ScopeType : ScopeType.scope();
  const EventHandlers = composeEventHandlers(...Handlers)(type);
  const ServiceContext = ServiceContextFactory.create(EventStream, Identifier, Scope, type, Configs);

  const EventsMap: {
    [EventName: string]: any[];
  } = {};

  for (const name of Object.keys(EventNames)) {
    EventsMap[name] = [];
  }

  const processor: IEventProcessor = {
    on: (eventName, listener) => {
      if (Array.isArray(EventsMap[eventName])) {
        EventsMap[eventName].push(listener);
      }
    },
    process: async (event, processAck) => {
      const Handler = EventHandlers.resolve(event);

      if (isNullOrUndefined(Handler)) {
        const listeners = EventsMap[EventNames.UNHANDLED];
        listeners.forEach((each) => each(EventNames.UNHANDLED, event, { scope: Scope, type: event.type, name: event.name }));
      } else {
        const currentState = undefined;
        const resulting: any = undefined;
        const result = await Handler.process(event, currentState);
        await Handler.processEffect({ event, result }, resulting, ServiceContext);
      }

      await processAck();
    },
  };

  Object.freeze(processor);

  return processor;
})(scopeType, identifier, stream, configs, eventHandlers);

Object.freeze(composeEventProcessor);
