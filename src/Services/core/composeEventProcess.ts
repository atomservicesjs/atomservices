import { EventStream, IServiceDefinition } from "atomservicescore";
import { composeEventHandlers } from "../../Events/composeEventHandlers";
import { ServicesNotifyData } from "../../Notifiers";
import { composeEventResult } from "./composeEventResult";
import { composeServiceContext } from "./composeServiceContext";
import { MetadataRefiner } from "./MetadataRefiner";

export const composeEventProcess = (definition: IServiceDefinition): EventStream.StreamProcessing => ((Definition): EventStream.StreamProcessing => {
  const EventHandlers = composeEventHandlers(...Definition.EventHandlers)(Definition.type);
  const ServiceContextComposing = composeServiceContext(Definition);
  const { Notifiers } = Definition;

  return Object.freeze(async (event, metadata, processAck) => {
    const EventHandler = EventHandlers.resolve(event);

    if (EventHandler) {
      metadata = MetadataRefiner.consume(metadata);
      const ServiceContext = ServiceContextComposing(metadata);
      const currentState = undefined;

      const result = await EventHandler.process(event, currentState, metadata);

      if (EventHandler.processEffect) {
        await EventHandler.processEffect({ event, metadata, result }, composeEventResult(ServiceContext, event), ServiceContext);
      }

      Notifiers.emit(ServicesNotifyData.SERVICE_EVENT_HANDLED(event.type, {
        eventID: event._id,
        metadata,
        scope: Definition.scope,
        type: Definition.type,
        // tslint:disable-next-line: object-literal-sort-keys
        name: event.name,
        aggregateID: event.aggregateID,
        _createdAt: event._createdAt,
        _createdBy: event._createdBy,
        _version: event._version,
      }, {
        event,
        metadata,
        result,
      }));
    }

    await processAck();
  });
})(definition);
