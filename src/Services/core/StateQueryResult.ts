import { IStateQueryResult, StateQueryAction, StateQueryStatus } from "atomservicescore";

const convert = (
  init: {
    ref: any;
    action: StateQueryAction;
    name: string;
    type: string;
    scope: string;
  },
  ext: {
    status: StateQueryStatus;
    error?: Error;
    state?: any;
  },
): IStateQueryResult => (Object.assign(
  {},
  {
    _ref: init.ref,
    origin: {
      action: init.action,
      name: init.name,
      scope: init.scope,
      type: init.type,
    },
  },
  ext,
));

export const StateQueryResult = (
  init: {
    ref: any;
    action: StateQueryAction;
    name: string;
    type: string;
    scope: string;
  },
) => ({
  error: (error: Error): IStateQueryResult =>
    convert(init, { status: "error", error }),
  success: <State = any>(state: State): IStateQueryResult<State> =>
    convert(init, { status: "success", state }),
  unhandled: (): IStateQueryResult =>
    convert(init, { status: "unhandled" }),
});
