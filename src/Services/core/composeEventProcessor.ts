import { Core, IEvent, IEventHandler, IServiceConfigs, Service } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeServiceContext } from "./composeServiceContext";
import { IEventProcessor } from "./IEventProcessor";

export const composeEventProcessor = (
  scope: string,
  identifier: Core.IIdentifier,
  stream: Core.IEventStream,
  stores?: Core.IEventStores,
) => (
  configs: IServiceConfigs,
  ...eventHandlers: IEventHandler[]
): IEventProcessor => ((Scope, Identifier, EventStream, EventStores, Configs, Handlers): IEventProcessor => {
  const { type: Type } = Configs;
  const EventHandlers = composeEventHandlers(...Handlers)(Type);

  const ComposeResulting = (ServiceContext: Service.IServiceContext) => (event: IEvent) => async (result: any) => {
    await ServiceContext.directTo(event._id, result);
  };
  const ComposeServiceContext = composeServiceContext(Scope, Type, Identifier, EventStream, Configs, EventStores);

  const processor: IEventProcessor = {
    process: async (event, metadata, processAck) => {
      const Handler = EventHandlers.resolve(event);

      if (Handler) {
        const ServiceContext = ComposeServiceContext(metadata.isReplay);
        const currentState = undefined;

        const result = await Handler.process(event, currentState, metadata);

        await Handler.processEffect({ event, result, metadata }, ComposeResulting(ServiceContext)(event), ServiceContext);
      }

      await processAck();
    },
  };

  Object.freeze(processor);

  return processor;
})(scope, identifier, stream, stores, configs, eventHandlers);

Object.freeze(composeEventProcessor);
