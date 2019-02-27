import { IServiceConfigs } from "atomservicescore";
import { IServiceConfigure } from "./IServiceConfigure";

const DefaultLevel = "public";

export const ServiceConfigure = (configs: IServiceConfigs): IServiceConfigure => ({
  level: (name) => {
    if (name[0] === "_") {
      return DefaultLevel;
    } else if (configs.events !== undefined && configs.events.levels !== undefined) {
      return configs.events.levels[name] || configs.events.levels._default || DefaultLevel;
    } else {
      return DefaultLevel;
    }
  },
});
