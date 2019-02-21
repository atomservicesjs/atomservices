import { IEvent, IEventHandler, IStateBase } from "atomservicescore";

export interface IEventHandlers<State extends IStateBase = any> {
  type: () => string;
  resolve: <Payloads = any, EventID = any, AggregateID = any, CreatedBy = any>(
    event: IEvent<Payloads, EventID, AggregateID, CreatedBy>,
  ) => IEventHandler<State, Payloads>;
  forEach: (callback: (handler: IEventHandler) => void) => number;
}
