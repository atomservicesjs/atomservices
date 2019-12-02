import { EventProcessType, EventStream, IServiceConfigs, IServiceStream } from "atomservicescore";

const DefaultLevel: EventStream.StreamLevel = "Public";
const DefaultProcessType: EventProcessType = "asynchronous";

export const ServiceStreamFactory = {
  create: (configs: IServiceConfigs): IServiceStream => ((Configs): IServiceStream => {
    const ServiceStream: IServiceStream = {
      level: (name) => (Configs.events && Configs.events[name]) ? (Configs.events[name].level || (Configs.events.__ && Configs.events.__.level) || DefaultLevel) : DefaultLevel,
      processType: (name) => (Configs.events && Configs.events[name]) ? (Configs.events[name].processType || DefaultProcessType) : DefaultProcessType,
    };

    Object.freeze(ServiceStream);

    return ServiceStream;
  })(configs),
};

Object.freeze(ServiceStreamFactory);
