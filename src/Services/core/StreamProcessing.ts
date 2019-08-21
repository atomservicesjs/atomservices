import { EventStream, IEvent } from "atomservicescore";

export type StreamProcessing =
  (event: IEvent, metadata: EventStream.IStreamMetadata, processAck: () => Promise<void>) => Promise<void>;
