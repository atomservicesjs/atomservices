import { EventHandler, IAnyState, IEvent, IEventHandler, IStateBase } from "atomservicescore";

export const EventHandlerBuilder = <
  State extends IStateBase = IAnyState,
  Event extends IEvent = IEvent,
  >(
    initial: {
      name: string;
      process: EventHandler.EventProcess<State, Event>;
      processEffect?: EventHandler.EventProcessEffect<State, Event>;
    },
): IEventHandler<State, Event> =>
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
