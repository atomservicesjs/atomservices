import { EventStream, IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { composeEventResult } from "./composeEventResult";
import { composeServiceContext } from "./composeServiceContext";
import { MetadataRefiner } from "./MetadataRefiner";

export const composeEventProcess = (definition: IServiceDefinition): EventStream.StreamProcessing => ((Definition): EventStream.StreamProcessing => {
  const EventHandlers = composeEventHandlers(...Definition.EventHandlers)(Definition.type);
  const ServiceContextComposing = composeServiceContext(Definition);

  return Object.freeze(async (event, metadata, processAck) => {
    const EventHandler = EventHandlers.resolve(event);
    metadata = MetadataRefiner.consume(metadata);
    // tslint:disable-next-line: no-console
    console.log(metadata);

    if (EventHandler) {
      const ServiceContext = ServiceContextComposing(metadata);
      const currentState = undefined;

      const result = await EventHandler.process(event, currentState, metadata);

      if (EventHandler.processEffect) {
        await EventHandler.processEffect({ event, metadata, result }, composeEventResult(ServiceContext, event), ServiceContext);
      }
    }

    await processAck();
  });
})(definition);
