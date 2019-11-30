import { EventStream, IServiceConfigs, IServiceStreamLevel } from "atomservicescore";

const DefaultLevel: EventStream.StreamLevel = "Public";

export const ServiceStreamLevelFactory = {
  create: (configs: IServiceConfigs): IServiceStreamLevel => ((Configs): IServiceStreamLevel => {
    const ServiceStreamLevel: IServiceStreamLevel = {
      level: (name) => (Configs.events && Configs.events[name]) ? (Configs.events[name].level || Configs.events._default.level || DefaultLevel) : DefaultLevel,
    };

    Object.freeze(ServiceStreamLevel);

    return ServiceStreamLevel;
  })(configs),
};

Object.freeze(ServiceStreamLevelFactory);
