import { IEvent, IEventHandler, IEventStream, IIdentifier, IServiceConfigs, IServiceContainer } from "atomservicescore";
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

  const Emitter = (eventName: string, event: IEvent, ...args: any[]) => {
    const listeners = EventsMap[eventName];

    for (const listener of listeners) {
      listener({ event, scope: Scope }, ...args);
    }
  };

  const Resulting = (event: IEvent) => async (result: any) => {
    await ServiceContext.directTo(event._id, result);
    Emitter(EventNames.RESULTED, event, result);
  };

  const processor: IEventProcessor = {
    on: (eventName, listener) => {
      if (Array.isArray(EventsMap[eventName])) {
        EventsMap[eventName].push(listener);
      }
    },
    process: async (event, processAck) => {
      const Handler = EventHandlers.resolve(event);

      if (isNullOrUndefined(Handler)) {
        Emitter(EventNames.UNHANDLED, event);
      } else {
        const currentState = undefined;

        const result = await Handler.process(event, currentState);
        Emitter(EventNames.PROCESSED, event, result);

        await Handler.processEffect({ event, result }, Resulting(event), ServiceContext);
      }

      await processAck();
    },
  };

  Object.freeze(processor);

  return processor;
})(scopeType, identifier, stream, configs, eventHandlers);

Object.freeze(composeEventProcessor);
