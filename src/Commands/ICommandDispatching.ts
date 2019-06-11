import { ICommand } from "atomservicescore";
import { DispatchResultType } from "./DispatchResultType";

export interface ICommandDispatching {
  dispatch: (type: string, command: ICommand) => Promise<DispatchResultType>;
}
