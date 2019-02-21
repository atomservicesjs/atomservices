import { Events, IEvent, IStateBase } from "atomservicescore";

export interface IStateRepository<State extends IStateBase = any, AggregateID = any> {
  applyEvent: (state: State, event: IEvent, process: Events.EventProcess<State>) => Promise<State>;
  queryByID: (aggregateID: AggregateID) => Promise<IStateBase>;
}
