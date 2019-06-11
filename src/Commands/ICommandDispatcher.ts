import { ICommand } from "atomservicescore";
import { DispatchResultType } from "./DispatchResultType";

export interface ICommandDispatcher {
  dispatch: (command: ICommand) => Promise<DispatchResultType>;
  scope: () => string;
  type: () => string;
}
