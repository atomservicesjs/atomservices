import { IEventHandler, IEventStores, IEventStream, IIdentifier, IReaction, IServiceConfigs } from "atomservicescore";

export interface IStreamConnector {
  connect: (
    scope: string,
    type: string,
    configs: IServiceConfigs,
    identifier: IIdentifier,
    stream: IEventStream,
    components: {
      EventHandlers: IEventHandler[];
      Reactions: IReaction[];
    },
    stores?: IEventStores,
  ) => Promise<void>;
}
