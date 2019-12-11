import { EventStream, IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeEventResulting } from "./composeEventResulting";
import { composeServiceContext } from "./composeServiceContext";
import { managedEventProcess } from "./managedEventProcess";

export const composeEventProcess = (definition: IServiceDefinition): EventStream.StreamProcessing => ((Definition): EventStream.StreamProcessing => {
  const EventHandlers = composeEventHandlers(...Definition.EventHandlers)(Definition.type);
  const composingServiceContext = composeServiceContext(Definition);
  const { Notifiers, ServiceStateStores } = Definition;

  const EventProcess: EventStream.StreamProcessing = async (event, metadata, processAck) => {
    const EventHandler = EventHandlers.resolve(event);

    if (EventHandler) {
      const ServiceContext = composingServiceContext(metadata);
      const resulting = composeEventResulting(ServiceContext, event);

      await managedEventProcess(EventHandler, ServiceContext, resulting, Notifiers, ServiceStateStores);
    }

    await processAck();
  };

  Object.freeze(EventProcess);

  return EventProcess;
})(definition);
