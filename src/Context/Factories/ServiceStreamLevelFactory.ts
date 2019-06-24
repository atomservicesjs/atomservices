import { EventStream, IServiceLevelsConfigs, IServiceStreamLevel } from "atomservicescore";

const DefaultLevel: EventStream.StreamLevel = "Public";

export const ServiceStreamLevelFactory = {
  create: (type: string, levelsConfigs: IServiceLevelsConfigs): IServiceStreamLevel => ((Type, LevelsConfigs): IServiceStreamLevel => {
    const ServiceLevel: IServiceStreamLevel = {
      level: (name) => LevelsConfigs.levels ? LevelsConfigs.levels[name] || LevelsConfigs.levels._default : DefaultLevel,
      type: () => Type,
    };

    Object.freeze(ServiceLevel);

    return ServiceLevel;
  })(type, levelsConfigs),
};

Object.freeze(ServiceStreamLevelFactory);
