import { EventStream } from "atomservicescore";

export interface IEventReactor {
  react: EventStream.EventReact;
}
