import { EventProcessType, EventStream, IServiceConfigs, IServiceConfigurate } from "atomservicescore";

const DefaultAllowDynamicVersion: boolean = false;
const DefaultLevel: EventStream.StreamLevel = "Public";
const DefaultProcessType: EventProcessType = "asynchronous";

export const ServiceConfigurateFactory = {
  create: (configs: IServiceConfigs): IServiceConfigurate => ((Configs): IServiceConfigurate => {
    const ServiceStream: IServiceConfigurate = {
      allowDynamicVersion: (name) => (Configs.events && Configs.events[name]) ?
        (Configs.events[name].allowDynamicVersion || (Configs.service && Configs.service.allowDynamicVersion) || DefaultAllowDynamicVersion) : DefaultAllowDynamicVersion,
      level: (name) => (Configs.events && Configs.events[name]) ?
        (Configs.events[name].level || (Configs.service && Configs.service.level) || DefaultLevel) : DefaultLevel,
      processType: (name) => (Configs.events && Configs.events[name]) ?
        (Configs.events[name].processType || (Configs.service && Configs.service.processType) || DefaultProcessType) : DefaultProcessType,
    };

    Object.freeze(ServiceStream);

    return ServiceStream;
  })(configs),
};

Object.freeze(ServiceConfigurateFactory);
