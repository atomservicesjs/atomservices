import { Events, IEventHandler, IStateBase } from "atomservicescore";

export const createEventHandler = <State extends IStateBase = any, Payloads = any>(
  type: string,
  name: string,
  process: Events.EventProcess<State, Payloads>,
  processEffect?: Events.EventProcessEffect<State, Payloads>,
): IEventHandler<State, Payloads> => {
  const handler: IEventHandler<State, Payloads> = Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: name,
      writable: false,
    },
    process: {
      configurable: false,
      enumerable: true,
      value: process,
      writable: false,
    },
    processEffect: {
      configurable: false,
      enumerable: true,
      value: processEffect,
      writable: false,
    },
    type: {
      configurable: false,
      enumerable: true,
      value: type,
      writable: false,
    },
  });

  return handler;
};
