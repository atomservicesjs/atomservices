import { IEvent, IServiceContext } from "atomservicescore";

export const composeEventResulting = (ServiceContext: IServiceContext, event: IEvent) =>
  (result: any) => ServiceContext.directTo(event._id, result);
