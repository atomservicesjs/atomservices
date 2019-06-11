import {
  CombineDuplicatedCommandDispatcherException,
  CombineInvalidScopeCommandDispatcherException,
} from "../Exceptions/Core";
import { ICommandDispatcher } from "./ICommandDispatcher";
import { ICommandDispatching } from "./ICommandDispatching";

interface IDispatchersMap {
  [type: string]: ICommandDispatcher;
}

export const combineCommandDispatchers = (scope: string, ...dispatchers: ICommandDispatcher[]): ICommandDispatching =>
  ((Scope, Dispatchers): ICommandDispatching => {
    const DISPATCHERS = Dispatchers.reduce((result: IDispatchersMap, dispatcher) => {
      if (dispatcher.scope() === Scope) {
        const type = dispatcher.type();

        if (result[type]) {
          throw CombineDuplicatedCommandDispatcherException(type);
        }

        result[type] = dispatcher;

        return result;
      } else {
        throw CombineInvalidScopeCommandDispatcherException(dispatcher.scope());
      }
    }, {} as IDispatchersMap);

    const Dispatching: ICommandDispatching = {
      dispatch: (type, command) => DISPATCHERS[type].dispatch(command),
    };

    Object.freeze(Dispatching);

    return Dispatching;
  })(scope, dispatchers);

Object.freeze(combineCommandDispatchers);
