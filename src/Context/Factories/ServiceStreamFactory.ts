import { EventProcessType, EventStream, IServiceConfigs, IServiceStream } from "atomservicescore";

const DefaultAllowNoVersion: boolean = false;
const DefaultLevel: EventStream.StreamLevel = "Public";
const DefaultProcessType: EventProcessType = "asynchronous";

export const ServiceStreamFactory = {
  create: (configs: IServiceConfigs): IServiceStream => ((Configs): IServiceStream => {
    const ServiceStream: IServiceStream = {
      allowNoVersion: (name) => (Configs.events && Configs.events[name]) ? (Configs.events[name].allowNoVersion || DefaultAllowNoVersion) : DefaultAllowNoVersion,
      level: (name) => (Configs.events && Configs.events[name]) ? (Configs.events[name].level || (Configs.service && Configs.service.level) || DefaultLevel) : DefaultLevel,
      processType: (name) => (Configs.events && Configs.events[name]) ? (Configs.events[name].processType || DefaultProcessType) : DefaultProcessType,
    };

    Object.freeze(ServiceStream);

    return ServiceStream;
  })(configs),
};

Object.freeze(ServiceStreamFactory);
