import { IEvent, IStateHandler, StateHandler } from "atomservicescore";

export const StateHandlerBuilder = <Event extends IEvent = IEvent>(
    composed: {
      name: string;
      apply: StateHandler.EventApply<Event>;
    },
): IStateHandler<Event> =>
  Object.defineProperties({}, {
    name: {
      configurable: false,
      enumerable: true,
      value: composed.name,
      writable: false,
    },
    // tslint:disable-next-line: object-literal-sort-keys
    apply: {
      configurable: false,
      enumerable: true,
      value: composed.apply,
      writable: false,
    },
  });
