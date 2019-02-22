import { IServiceConfigs } from "atomservicescore";
import { IServiceConfigure } from "./IServiceConfigure";

export const ServiceConfigure = (configs: IServiceConfigs): IServiceConfigure => ({
  level: (name) => {
    if (name[0] === "_") {
      return "public";
    } else if (configs.events !== undefined && configs.events.levels !== undefined) {
      return configs.events.levels[name] || configs.events.levels._default;
    } else {
      return "public";
    }
  },
});
