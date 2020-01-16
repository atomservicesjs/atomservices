import { EventStream, IEvent, IEventHandler, INotifiers, IServiceContext } from "atomservicescore";
import { ServicesNotifyData } from "../../Notifiers";
import { MetadataRefiner } from "./MetadataRefiner";

export const operateEventProcess = (
  EventHandler: IEventHandler,
  ServiceContext: IServiceContext,
  resulting: (result: any) => Promise<void>,
  Notifiers: INotifiers,
  ServiceStateStores: any,
) =>
  async (service: { scope: string; type: string; }, event: IEvent, metadata: EventStream.IStreamMetadata) => {
    metadata = MetadataRefiner.consume(metadata);
    try {
      const result = await EventHandler.process(event, metadata, ServiceStateStores);

      if (EventHandler.processEffect) {
        await EventHandler.processEffect({ event, metadata, result }, resulting, ServiceContext);
      }

      Notifiers.emit(ServicesNotifyData.SERVICE_EVENT_HANDLED(event.type, {
        eventID: event._id,
        metadata,
        scope: service.scope,
        type: service.type,
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
    } catch (error) {
      Notifiers.error(ServicesNotifyData.SERVICE_COMMAND_ERROR(event.name, {
        scope: service.scope,
        type: service.type,
        // tslint:disable-next-line: object-literal-sort-keys
        name: event.name,
      }, {
        event,
      }), error);
    }
  };
