import { EventStream, IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeEventResulting } from "./composeEventResulting";
import { composeServiceContext } from "./composeServiceContext";
import { operateEventProcess } from "./operateEventProcess";

export const composeEventProcess = (definition: IServiceDefinition): EventStream.StreamProcessing => ((Definition): EventStream.StreamProcessing => {
  const EventHandlers = composeEventHandlers(...Definition.EventHandlers)(Definition.type);
  const composingServiceContext = composeServiceContext(Definition);
  const { Notifiers } = Definition;
  const ServiceStateStores: any = {};

  const EventProcess: EventStream.StreamProcessing = async (event, metadata, processAck) => {
    const processType = Definition.ServiceConfigurate.processType(event.name);

    if (processType === "asynchronous") {
      const EventHandler = EventHandlers.resolve(event);

      if (EventHandler) {
        const ServiceContext = composingServiceContext(metadata);
        const resulting = composeEventResulting(ServiceContext, event);

        await operateEventProcess(EventHandler, ServiceContext, resulting, Notifiers, ServiceStateStores)(Definition, event, metadata);
      }
    }

    await processAck();
  };

  Object.freeze(EventProcess);

  return EventProcess;
})(definition);
