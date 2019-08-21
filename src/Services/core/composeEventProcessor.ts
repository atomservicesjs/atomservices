import { IEvent, IEventHandler, IEventStores, IEventStream, IIdentifier, IServiceConfigs, IServiceContext } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeServiceContext } from "./composeServiceContext";
import { StreamProcessing } from "./StreamProcessing";

export const composeEventProcessor = (
  scope: string,
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
  handlers: IEventHandler[],
  enhancers: {
    EventStores?: IEventStores,
  },
) => ((Scope, Identifier, EventStream, Configs, Handlers, Enhancers) => {
  const { type: Type } = Configs;
  const { EventStores } = Enhancers;
  const EventHandlers = composeEventHandlers(...Handlers)(Type);
  const ComposeServiceContext = composeServiceContext(Scope, Type, Identifier, EventStream, Configs, EventStores);

  const ComposeResulting = (ServiceContext: IServiceContext, event: IEvent) => async (result: any) => {
    await ServiceContext.directTo(event._id, result);
  };

  const processing: StreamProcessing = async (event, metadata, processAck) => {
    const Handler = EventHandlers.resolve(event);

    if (Handler) {
      const ServiceContext = ComposeServiceContext(metadata.isReplay);
      const currentState = undefined;

      const result = await Handler.process(event, currentState, metadata);

      await Handler.processEffect({ event, result, metadata }, ComposeResulting(ServiceContext, event), ServiceContext);
    }

    await processAck();
  };

  Object.freeze(processing);

  return processing;
})(scope, identifier, stream, configs, handlers, enhancers);

Object.freeze(composeEventProcessor);
