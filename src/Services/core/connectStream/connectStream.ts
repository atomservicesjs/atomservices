import { IServiceDefinition, IServiceStreamDefinition } from "atomservicescore";
import { composeEventProcess } from "../composeEventProcess";
import { composeEventReactions } from "../composeEventReactions";
import { mapHandlersEvents } from "./mapHandlersEvents";
import { mapReactionsEvents } from "./mapReactionsEvents";

export const connectStream = async (definition: IServiceDefinition) => (async (Definition) => {
  const EventProcess = composeEventProcess(Definition);
  const EventReactions = composeEventReactions(Definition);

  const StreamDefinition: IServiceStreamDefinition = Object.freeze({
    handlers: {
      events: mapHandlersEvents(Definition),
      processing: EventProcess,
    },
    reactions: {
      events: mapReactionsEvents(Definition),
      processes: EventReactions,
    },
    scope: Definition.scope,
    type: Definition.type,
  });

  Definition.EventStream.subscribe(StreamDefinition);

  await Definition.EventStream.connect();
})(definition);
