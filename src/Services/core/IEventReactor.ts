import { Core } from "atomservicescore";

export interface IEventReactor {
  react: Core.EventStream.EventReact;
}
