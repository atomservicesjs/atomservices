import { EventHandler, IEventHandler, IStateBase } from "atomservicescore";
import { Compose } from "../../Common/Compose";

export const EventHandlerBuilder = <State extends IStateBase, Payloads>(
  initial: {
    process: EventHandler.EventProcess<State, Payloads>;
    processEffect?: EventHandler.EventProcessEffect<State, Payloads>;
  },
  eventBase: Compose,
): IEventHandler<State, Payloads> =>
  Object.defineProperties(eventBase({}), {
    process: {
      configurable: false,
      enumerable: true,
      value: initial.process,
      writable: false,
    },
    processEffect: {
      configurable: false,
      enumerable: true,
      value: initial.processEffect || EventHandler.DefaultEventProcessEffect,
      writable: false,
    },
  });
