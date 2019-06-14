import { DispatchResult, ICommand } from "atomservicescore";

export interface ICommandDispatcher {
  scope: () => string;
  type: () => string;
  dispatch: (command: ICommand) => Promise<DispatchResult.DispatchResultType>;
}
