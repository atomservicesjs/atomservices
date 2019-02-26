import { common, IEvent, IEventStream } from "atomservicescore";

interface IStream {
  [scope: string]: {
    [type: string]: {
      [name: string]: any[];
    };
  };
}

export const createLocalEventStream = (ackListener?: (event: IEvent) => void): IEventStream =>
  ((): IEventStream => {
    const PublicStreams: IStream = {};
    const ScopeStreams: IStream = {};
    const DirectStreams: {
      [ref: string]: Array<(result: any) => void>;
    } = {};

    return {
      directTo: async (ref, data) => {
        if (DirectStreams[ref] !== undefined) {
          DirectStreams[ref].forEach((stream) => stream(data));
          delete DirectStreams[ref];
        }
      },
      listenTo: (ref, listener) => {
        if (DirectStreams[ref] === undefined) {
          DirectStreams[ref] = [];
        }

        DirectStreams[ref].push(listener);
      },
      publish: async (event, { scope, level }) => {
        const { name, type } = event;

        const Streams = level === "public" ? PublicStreams : ScopeStreams;

        if (Streams[scope] && Streams[scope][type] && Streams[scope][type][name]) {
          const ack = common.createLocalAck(event, ackListener);
          const subscribers = Streams[scope][type][name];

          subscribers.forEach((process) => process(event, ack));
        }
      },
      subscribe: (on, to, process) => {
        const { name, type, scope, level } = on;
        const Streams = level === "public" ? PublicStreams : ScopeStreams;

        if (Streams[scope] === undefined) {
          Streams[scope] = {};
        }

        if (Streams[scope][type] === undefined) {
          Streams[scope][type] = {};
        }

        if (Streams[scope][type][name] === undefined) {
          Streams[scope][type][name] = [];
        }

        Streams[scope][type][name].push(process);
      },
    };
  })();
