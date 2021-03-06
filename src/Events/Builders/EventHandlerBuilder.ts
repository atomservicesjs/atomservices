import { EventHandler, IEvent, IEventHandler } from "atomservicescore";

export const EventHandlerBuilder = <Event extends IEvent = IEvent, ProcessResult = EventHandler.AnyProcessResult>(
    composed: {
      name: string;
      process: EventHandler.EventProcessHandle<Event, ProcessResult>;
      processEffect?: EventHandler.EventProcessEffectHandle<Event, ProcessResult>;
    },
): IEventHandler<Event, ProcessResult> =>
  Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: composed.name,
      writable: false,
    },
    process: {
      configurable: false,
      enumerable: true,
      value: composed.process,
      writable: false,
    },
    processEffect: {
      configurable: false,
      enumerable: true,
      value: composed.processEffect ? composed.processEffect : undefined,
      writable: false,
    },
  });
