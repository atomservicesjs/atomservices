import { DispatchListening, DispatchResult, ICommand } from "atomservicescore";

export interface ICommandDispatcher {
  scope: () => string;
  type: () => string;
  dispatch: (command: ICommand, listening?: DispatchListening) => Promise<DispatchResult.DispatchResultType>;
}
