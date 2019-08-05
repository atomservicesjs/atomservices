import {
  CombineDuplicatedCommandDispatcherException,
  CombineInvalidScopeCommandDispatcherException,
} from "../Exceptions/Core";
import { ICommandDispatcher } from "./ICommandDispatcher";
import { ICommandDispatchers } from "./ICommandDispatchers";

interface IDispatchersMap {
  [type: string]: ICommandDispatcher;
}

export const combineCommandDispatchers = (scope: string, ...dispatchers: ICommandDispatcher[]): ICommandDispatchers =>
  ((Scope, Dispatchers): ICommandDispatchers => {
    const DISPATCHERS_MAP = Dispatchers.reduce((result: IDispatchersMap, dispatcher) => {
      if (dispatcher.scope() === Scope) {
        const type = dispatcher.type();

        if (result[type]) {
          throw CombineDuplicatedCommandDispatcherException(type);
        } else {
          result[type] = dispatcher;
        }

      } else {
        throw CombineInvalidScopeCommandDispatcherException(dispatcher.scope());
      }

      return result;
    }, {} as IDispatchersMap);

    const DISPATCHERS: ICommandDispatchers = {
      dispatch: (type, command, listening) => DISPATCHERS_MAP[type].dispatch(command, listening),
    };

    Object.freeze(DISPATCHERS);

    return DISPATCHERS;
  })(scope, dispatchers);

Object.freeze(combineCommandDispatchers);
