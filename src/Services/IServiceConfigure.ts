import { EventStreams } from "atomservicescore";

export interface IServiceConfigure {
  level: (name: string) => EventStreams.EventLevel;
}
