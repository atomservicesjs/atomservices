import { EventStream } from "atomservicescore";

const DirectingStream: any = {};

export const LocalDirectStream: EventStream.IEventDirecting = Object.freeze({
  directTo: async (ref, data) => {
    if (DirectingStream[ref]) {
      DirectingStream[ref](data);
      delete DirectingStream[ref];
    }
  },
  listenTo: async (ref, listener) => {
    DirectingStream[ref] = listener;
  },
});
