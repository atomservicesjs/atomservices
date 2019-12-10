import { EventStream, IServiceDefinition } from "atomservicescore";

export const mapHandlersEvents = (definition: IServiceDefinition): Array<{ name: string; level: EventStream.StreamLevel; }> =>
  definition.EventHandlers.reduce((result, { name }) => {
    const level = definition.ServiceConfigurate.level(name);
    const processType = definition.ServiceConfigurate.processType(name);

    if (processType === "asynchronous") {
      result.push({ name, level });
    }

    return result;
  }, [] as Array<{ name: string; level: EventStream.StreamLevel; }>);
