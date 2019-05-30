import { ICommandDispatcher } from "./ICommandDispatcher";
import { ICommandDispatcherLocator } from "./ICommandDispatcherLocator";

export const createCommandDispatcherLocator = (): ICommandDispatcherLocator => ((): ICommandDispatcherLocator => {
  const DISPATCHERS: {
    [scope: string]: {
      [type: string]: ICommandDispatcher;
    };
  } = {};

  return {
    register: (dispatcher) => {
      const scope = dispatcher.scope();
      const type = dispatcher.type();

      if (!DISPATCHERS[scope]) {
        DISPATCHERS[scope] = {};
      }

      DISPATCHERS[scope][type] = dispatcher;
    },
    resolve: (scope, type) => {
      if (!DISPATCHERS[scope]) {
        return undefined;
      }

      return DISPATCHERS[scope][type];
    },
  };
})();
