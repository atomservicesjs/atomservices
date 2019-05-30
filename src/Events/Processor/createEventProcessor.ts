import { IEvent, IEventHandler, IEventStream, IIdentifier } from "atomservicescore";
import { ServiceEventStream, ServiceIdentifier } from "../../Context";
import { combineEventHandlers } from "../combineEventHandlers";

export const createEventProcessor = (
  scope: string,
  identifier: IIdentifier,
  stream: IEventStream,
) => (
  type: string,
  ...eventHandlers: IEventHandler[]
) => {
    const EventHandlers = combineEventHandlers(...eventHandlers)(type);
    const ServiceStream = ServiceEventStream.composeServiceEventStream(stream)(type, scope, configs);
    const Identifier = ServiceIdentifier.composeServiceIdentifier(identifier)(type);

    return {
      process: async (event: IEvent): Promise<void> => {
        const handler = EventHandlers.resolve(event);

        if (handler !== undefined) {
          await handler.process(event);
        }
      },
      scope: () => scope,
      type: () => type,
    };
  };
