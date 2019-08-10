import { Core, IEventHandler, IReaction, IServiceConfigs } from "atomservicescore";

export interface IStreamConnector {
  connect: (
    scope: string,
    type: string,
    configs: IServiceConfigs,
    identifier: Core.IIdentifier,
    stream: Core.IEventStream,
    components: {
      EventHandlers: IEventHandler[];
      Reactions: IReaction[];
    },
    stores?: Core.IEventStores,
  ) => Promise<void>;
}
