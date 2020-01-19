import { EventStream, IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeStateApplier } from "../../States/composeStateApplier";
import { composeStateHandlers } from "../../States/composeStateHandlers";

import { composeEventResulting } from "./composeEventResulting";
import { composeServiceContext } from "./composeServiceContext";
import { operateEventProcess } from "./operateEventProcess";

export const composeEventProcess = (definition: IServiceDefinition): EventStream.StreamProcessing => ((Definition): EventStream.StreamProcessing => {
  const EventHandlers = composeEventHandlers(...Definition.EventHandlers)(Definition.type);
  const StateHandlers = composeStateHandlers(...Definition.StateHandlers)(Definition.type);
  const StateApplier = composeStateApplier({ StateHandlers });

  const composingServiceContext = composeServiceContext(Definition);
  const { Notifiers } = Definition;

  const EventProcess: EventStream.StreamProcessing = async (event, metadata, processAck) => {
    const processType = Definition.ServiceConfigurate.processType(event.name);

    if (processType === "asynchronous") {
      const EventHandler = EventHandlers.resolve(event);

      if (EventHandler) {
        const ServiceContext = composingServiceContext(metadata);
        const resulting = composeEventResulting(ServiceContext, event);

        await operateEventProcess(EventHandler, StateApplier, ServiceContext, resulting, Notifiers)(Definition, event, metadata);
      }
    }

    await processAck();
  };

  Object.freeze(EventProcess);

  return EventProcess;
})(definition);
