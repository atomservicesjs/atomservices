import { IEvent, IServiceContext, IStateQueryResult } from "atomservicescore";

export const composeProcessResult = (
  context: IServiceContext,
  stateResult: { success: (state: any) => IStateQueryResult; },
) => (event: IEvent, result: any) => context.directTo(event._id, stateResult.success(result));
