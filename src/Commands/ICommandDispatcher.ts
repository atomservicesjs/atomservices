import { DispatchResult, ICommand } from "atomservicescore";

export interface ICommandDispatcher {
  dispatch: (command: ICommand) => Promise<DispatchResult.DispatchResultType>;
  scope: () => string;
  type: () => string;
}
