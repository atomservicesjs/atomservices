import { EventStream } from "atomservicescore";

export const MetadataRefiner = {
  consume: (metadata: EventStream.IStreamMetadata) => {
    const meta = metadata.__;
    const { time } = meta.dispatch;
    const now = Date.now();
    const duration = now - time;

    return Object.assign({}, metadata, {
      __: {
        ...meta,
        dispatch: {
          duration,
          time,
        },
      },
    });
  },
  dispatch: (metadata: EventStream.IStreamMetadata) => Object.assign({}, metadata, {
    __: {
      dispatch: {
        time: Date.now(),
      },
    },
  }),
};
