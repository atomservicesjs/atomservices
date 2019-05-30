import { ICommand, Services, StateQueryResultListener } from "atomservicescore";

export interface ICommandDispatcher {
  dispatch: (command: ICommand, listener?: StateQueryResultListener) => Promise<Services.DispatchResultType>;
  scope: () => string;
  type: () => string;
}
