import { IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IServiceConfigs } from "atomservicescore";

export type IConnectStream = (
  scope: string,
  identifier: IIdentifier,
  stream: IEventStream,
  configs: IServiceConfigs,
  components: {
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  },
  enhancers: {
    EventStores?: IEventStores,
  },
) => Promise<void>;
