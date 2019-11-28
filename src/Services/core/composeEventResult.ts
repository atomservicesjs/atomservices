import { IEvent, IServiceContext } from "atomservicescore";

export const composeEventResult = (ServiceContext: IServiceContext, event: IEvent) =>
  (result: any) => ServiceContext.directTo(event._id, result);
