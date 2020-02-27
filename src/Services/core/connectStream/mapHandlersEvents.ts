import { EventStream, IServiceDefinition } from "atomservicescore";

export const mapHandlersEvents = (definition: IServiceDefinition): { name: string; level: EventStream.StreamLevel; }[] =>
  definition.EventHandlers.reduce((result, { name }) => {
    const level = definition.ServiceConfigurate.level(name);
    result.push({ name, level });

    return result;
  }, [] as { name: string; level: EventStream.StreamLevel; }[]);
