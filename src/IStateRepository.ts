import { EventHandler, IEvent, IStateBase } from "atomservicescore";

export interface IStateRepository<State extends IStateBase = any, AggregateID = any> {
  applyEvent: (state: State, event: IEvent, process: EventHandler.EventProcess<State>) => Promise<State>;
  queryByID: (aggregateID: AggregateID) => Promise<IStateBase>;
}
