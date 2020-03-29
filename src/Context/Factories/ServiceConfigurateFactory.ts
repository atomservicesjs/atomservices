import { EventProcessType, EventVersioning, EventStream, IServiceConfigs, IServiceConfigurate } from "atomservicescore";

const DefaultVersioning: EventVersioning = "None";
const DefaultLevel: EventStream.StreamLevel = "Public";
const DefaultProcessType: EventProcessType = "asynchronous";

export const ServiceConfigurateFactory = {
  create: (configs: IServiceConfigs): IServiceConfigurate => ((Configs): IServiceConfigurate => {
    const ServiceStream: IServiceConfigurate = {
      level: (name) => (Configs.events && Configs.events[name]) ?
        (Configs.events[name].level || (Configs.service && Configs.service.level) || DefaultLevel) :
        (Configs.service && Configs.service.level) || DefaultLevel,
      processType: (name) => (Configs.events && Configs.events[name]) ?
        (Configs.events[name].processType || (Configs.service && Configs.service.processType) || DefaultProcessType) :
        (Configs.service && Configs.service.processType) || DefaultProcessType,
      versioning: (name) => (Configs.events && Configs.events[name]) ?
        (Configs.events[name].versioning || (Configs.service && Configs.service.versioning) || DefaultVersioning) :
        (Configs.service && Configs.service.versioning) || DefaultVersioning,
    };

    Object.freeze(ServiceStream);

    return ServiceStream;
  })(configs),
};

Object.freeze(ServiceConfigurateFactory);
