import { DispatchResult, ICommand } from "atomservicescore";

export interface ICommandDispatcher {
  scope: () => string;
  type: () => string;
  dispatch: (command: ICommand, listening?: (data: any) => void) => Promise<DispatchResult.IDispatchResult>;
}
