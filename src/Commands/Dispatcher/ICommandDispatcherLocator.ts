import { ICommandDispatcher } from "./ICommandDispatcher";

export interface ICommandDispatcherLocator {
  resolve: (scope: string, type: string) => ICommandDispatcher | undefined;
  register: (dispatcher: ICommandDispatcher) => void;
}
