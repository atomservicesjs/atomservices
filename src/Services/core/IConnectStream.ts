import { IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IServiceConfigs } from "atomservicescore";

export type IConnectStream = (
  scope: string,
  stream: IEventStream,
  configs: IServiceConfigs,
  components: {
    EventHandlers?: IEventHandler[];
    Reactions?: IReaction[];
  },
  enhancers: {
    EventStores?: IEventStores;
    Identifier?: IIdentifier;
  },
) => Promise<void>;
