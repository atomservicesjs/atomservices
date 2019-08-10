import { Core, IServiceConfigsLevels, Service } from "atomservicescore";

const DefaultLevel: Core.EventStream.StreamLevel = "Public";

export const ServiceStreamLevelFactory = {
  create: (
    type: string,
    configs: IServiceConfigsLevels,
  ): Service.IServiceStreamLevel => ((Type, Configs): Service.IServiceStreamLevel => {
    const ServiceLevel: Service.IServiceStreamLevel = {
      level: (name) => Configs.levels ? Configs.levels[name] || Configs.levels._default : DefaultLevel,
      type: () => Type,
    };

    Object.freeze(ServiceLevel);

    return ServiceLevel;
  })(type, configs),
};

Object.freeze(ServiceStreamLevelFactory);
