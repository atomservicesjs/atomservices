import { DispatchResult, ICommand } from "atomservicescore";

export interface ICommandDispatching {
  dispatch: (type: string, command: ICommand) => Promise<DispatchResult.DispatchResultType>;
}
