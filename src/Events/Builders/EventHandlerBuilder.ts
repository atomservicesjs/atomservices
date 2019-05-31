import { EventHandler, IAnyState, IEvent, IEventHandler, IStateBase } from "atomservicescore";

export const EventHandlerBuilder = <
  State extends IStateBase = IAnyState,
  Event extends IEvent = IEvent,
  >(
    initial: {
      name: string;
      process: EventHandler.EventProcess<Event>;
      processEffect?: EventHandler.EventProcessEffect<Event>;
    },
): IEventHandler<Event> =>
  Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: initial.name,
      writable: false,
    },
    process: {
      configurable: false,
      enumerable: true,
      value: initial.process,
      writable: false,
    },
    processEffect: {
      configurable: false,
      enumerable: true,
      value: initial.processEffect || EventHandler.DefaultProcessEffect,
      writable: false,
    },
  });
