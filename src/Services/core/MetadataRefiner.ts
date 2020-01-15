import { EventStream } from "atomservicescore";

export const MetadataRefiner = {
  consume: (metadata: EventStream.IStreamMetadata) => {
    const meta = metadata.__ || {};
    const now = Date.now();
    let duration: any;

    const { time } = meta.dispatch || {};

    if (time) {
      duration = now - time;
    }

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
