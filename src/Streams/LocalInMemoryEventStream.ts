import { IEventStream } from "atomservicescore";
import { LocalDirectStream } from "./LocalDirectStream";
import { LocalEventStream } from "./LocalEventStream";

export const LocalInMemoryEventStream: IEventStream = Object.freeze({
  connect: LocalEventStream.connect,
  directTo: LocalDirectStream.directTo,
  listenTo: LocalDirectStream.listenTo,
  publish: LocalEventStream.publish,
  subscribe: LocalEventStream.subscribe,
});
