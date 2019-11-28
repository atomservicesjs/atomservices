import { EventStream, IServiceConfigs, IServiceStreamLevel } from "atomservicescore";

const DefaultLevel: EventStream.StreamLevel = "Public";

export const ServiceStreamLevelFactory = {
  create: (configs: IServiceConfigs): IServiceStreamLevel => ((Configs): IServiceStreamLevel => {
    const ServiceStreamLevel: IServiceStreamLevel = {
      level: (name) => Configs.levels ? Configs.levels[name] || Configs.levels._default : DefaultLevel,
    };

    Object.freeze(ServiceStreamLevel);

    return ServiceStreamLevel;
  })(configs),
};

Object.freeze(ServiceStreamLevelFactory);
