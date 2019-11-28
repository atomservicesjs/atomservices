import { IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeEventResult } from "./composeEventResult";
import { composeServiceContext } from "./composeServiceContext";
import { StreamProcessing } from "./StreamProcessing";

export const composeEventProcess = (definition: IServiceDefinition): StreamProcessing => {
  const EventHandlers = composeEventHandlers(...definition.EventHandlers)(definition.type);
  const ServiceContextComposing = composeServiceContext(definition);

  return Object.freeze(async (event, metadata, processAck) => {
    const EventHandler = EventHandlers.resolve(event);

    if (EventHandler) {
      const ServiceContext = ServiceContextComposing(metadata.isReplay);
      const currentState = undefined;

      const result = await EventHandler.process(event, currentState, metadata);

      if (EventHandler.processEffect) {
        await EventHandler.processEffect({ event, metadata, result }, composeEventResult(ServiceContext, event), ServiceContext);
      }
    }

    processAck();
  });
};
