import { DispatchResult, ICommand } from "atomservicescore";

export interface ICommandDispatchers {
  dispatch: (type: string, command: ICommand, listening?: (data: any) => void) => Promise<DispatchResult.DispatchResultType>;
}
