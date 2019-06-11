import { EventStream, IServiceConfigs, IServiceStreamLevel } from "atomservicescore";

const DefaultLevel: EventStream.StreamLevel = "Public";

export const ServiceStreamLevelFactory = {
  create: (type: string, configs: IServiceConfigs): IServiceStreamLevel => ((Type, Configs): IServiceStreamLevel => {
    const ServiceLevel: IServiceStreamLevel = {
      level: (name) => Configs.levels ? Configs.levels[name] || Configs.levels._default : DefaultLevel,
      type: () => Type,
    };

    Object.freeze(ServiceLevel);

    return ServiceLevel;
  })(type, configs),
};

Object.freeze(ServiceStreamLevelFactory);
