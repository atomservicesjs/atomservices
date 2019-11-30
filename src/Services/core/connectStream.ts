import { EventStream, IServiceDefinition, IServiceStreamDefinition } from "atomservicescore";
import { composeEventProcess } from "./composeEventProcess";
import { composeEventReactions } from "./composeEventReactions";

export const connectStream = async (definition: IServiceDefinition) => (async (Definition) => {
  const EventProcess = composeEventProcess(Definition);
  const EventReactions = composeEventReactions(Definition);

  const Stream: IServiceStreamDefinition = Object.freeze({
    handlers: {
      events: Definition.EventHandlers.reduce((result, { name }) => {
        const level = Definition.ServiceStreamLevel.level(name);
        result.push({ level, name });

        return result;
      }, [] as Array<{ name: string; level: EventStream.StreamLevel; }>),
      processing: EventProcess,
    },
    reactions: {
      events: Definition.Reactions,
      processes: EventReactions,
    },
    scope: Definition.scope,
    type: Definition.type,
  });

  Definition.EventStream.subscribe(Stream);

  await Definition.EventStream.connect();
})(definition);
