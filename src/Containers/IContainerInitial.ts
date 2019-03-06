import { IContainerConfigs, Services } from "atomservicescore";

export interface IContainerInitial {
  name: string;
  services: Services.ServiceBootstrap[];
  configs?: IContainerConfigs;
}
