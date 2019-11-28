import { IServiceDefinition } from "atomservicescore";
import { composeEventProcess } from "./composeEventProcess";
import { IStreamConnect } from "./IStreamConnect";

export const StreamConnect: IStreamConnect = async (definition: IServiceDefinition) => {
  const { EventHandlers, EventStream, ServiceStreamLevel, scope, type } = definition;
  const EventProcess = composeEventProcess(definition);

  const ps: Array<Promise<any>> = EventHandlers.map((EventHandler) => EventStream.subscribe(
    {
      level: ServiceStreamLevel.level(EventHandler.name),
      name: EventHandler.name,
      scope,
      type,
    },
    {
      channel: "EventHandler",
      scope,
      type,
    },
    EventProcess,
  ));

  await Promise.all(ps);
};
