import { EventHandler, IEvent, IEventHandler } from "atomservicescore";

export const EventHandlerBuilder = <Event extends IEvent = IEvent, ProcessResult = any, State = any, Resulting = any>(
    composed: {
      name: string;
      process: EventHandler.EventProcess<Event, ProcessResult, State>;
      processEffect?: EventHandler.EventProcessEffect<Event, ProcessResult, Resulting>;
    },
): IEventHandler<Event, ProcessResult, State, Resulting> =>
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
      value: composed.processEffect || EventHandler.DefaultEventProcessEffect,
      writable: false,
    },
  });
