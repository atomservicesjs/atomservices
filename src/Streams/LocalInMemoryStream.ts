import { IEventStream, IServiceStreamDefinition } from "atomservicescore";

const Definitions: IServiceStreamDefinition[] = [];
const DirectingStream: any = {};

export const LocalInMemoryStream: IEventStream = {
  connect: async () => { },
  directTo: async (ref, data) => {
    if (DirectingStream[ref]) {
      DirectingStream[ref](data);
      delete DirectingStream[ref];
    }
  },
  listenTo: async (ref, listener) => {
    DirectingStream[ref] = listener;
  },
  publish: async (on, metadata, event) => {
    const { level, scope } = on;
  },
  subscribe: async (definition) => {
    Definitions.push(definition);
  },
};
