import { IEventStream, IServiceConfigs, IServiceEventStream } from "atomservicescore";
import { ServiceStreamLevelFactory } from "./ServiceStreamLevelFactory";

export const ServiceEventStreamFactory = {
  create: (
    stream: IEventStream,
    scope: string,
    type: string,
    configs: IServiceConfigs,
  ): IServiceEventStream => ((Stream, Scope, Type, Configs): IServiceEventStream => {
    const ServiceStreamLevel = ServiceStreamLevelFactory.create(Type, Configs);

    const ServiceStream: IServiceEventStream = {
      dispatch: async (event) => Stream.publish(event, { level: ServiceStreamLevel.level(event.name), scope: Scope }),
      type: () => Type,
    };

    Object.freeze(ServiceStream);

    return ServiceStream;
  })(stream, scope, type, configs),
};

Object.freeze(ServiceEventStreamFactory);
