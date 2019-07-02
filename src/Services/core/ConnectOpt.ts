import { IEventHandler, IReaction, IServiceEventStream } from "atomservicescore";
import { IEventProcessor } from "./IEventProcessor";
import { IEventReactor } from "./IEventReactor";

export type ConnectOpt = (components: {
  EventHandlers: IEventHandler[];
  Reactions: IReaction[];
  EventProcessor: IEventProcessor;
  EventReactor: IEventReactor;
  ServiceEventStream: IServiceEventStream;
}) => Promise<void>;

export const DefaultConnectOpt: ConnectOpt = async (components) => {
  const { EventHandlers, EventProcessor, EventReactor, Reactions, ServiceEventStream } = components;
  const ps: Array<Promise<any>> = [];

  for (const EventHandler of EventHandlers) {
    ps.push(ServiceEventStream.registerEventProcess(EventHandler, EventProcessor.process));
  }

  for (const Reaction of Reactions) {
    ps.push(ServiceEventStream.registerEventReact(Reaction, EventReactor.react));
  }

  await Promise.all(ps);
};
