import { EventStreams, IServiceConfigs } from "atomservicescore";

const DefaultLevel = "public";

export const composeServiceLevels = (configs: IServiceConfigs) => ({
  level: (name: string): EventStreams.EventLevel => {
    if (name[0] === "_") {
      return DefaultLevel;
    } else if (configs.events !== undefined && configs.events.levels !== undefined) {
      return configs.events.levels[name] || configs.events.levels._default || DefaultLevel;
    } else {
      return DefaultLevel;
    }
  },
});
