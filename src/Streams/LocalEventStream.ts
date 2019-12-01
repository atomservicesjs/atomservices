import { EventStream, IServiceStreamDefinition } from "atomservicescore";
import { endpoints } from "./endpoints";

const StreamDefinitions: IServiceStreamDefinition[] = [];
const StreamRegistry: {
  [exchange: string]: EventStream.StreamProcessing[];
} = {};

export const LocalEventStream: EventStream.IEventPublishing & EventStream.IEventSubscribing = Object.freeze({
  connect: async () => {
    for (const definition of StreamDefinitions) {
      const { handlers, reactions, scope, type } = definition;
      const Public = endpoints.toExchange({ level: "Public", scope, type });
      const Scope = endpoints.toExchange({ level: "Scope", scope, type });

      if (StreamRegistry[Public] === undefined) {
        StreamRegistry[Public] = [];
      }

      if (StreamRegistry[Scope] === undefined) {
        StreamRegistry[Scope] = [];
      }

      StreamRegistry[Public].push(handlers.processing);
      StreamRegistry[Scope].push(handlers.processing);

      const exchanges: string[] = [];

      reactions.events.forEach((reaction) => {
        const ex = endpoints.toExchange({ level: "Public", scope: reaction.scope, type: reaction.type });

        if (StreamRegistry[ex] === undefined) {
          StreamRegistry[ex] = [];
        }

        if (exchanges.indexOf(ex) === -1) {
          StreamRegistry[ex].push(reactions.processes[scope]);
          exchanges.push(ex);
        }
      });
    }
  },
  publish: async (on, metadata, event) => {
    const { level, scope } = on;
    const { type } = event;
    const ex = endpoints.toExchange({ level, scope, type });

    if (StreamRegistry[ex]) {
      // tslint:disable-next-line: no-empty
      const processAck: any = () => { };
      StreamRegistry[ex].forEach((each) => each(event, metadata, processAck));
    }
  },
  subscribe: async (definition) => {
    StreamDefinitions.push(definition);
  },
});
