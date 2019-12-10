import { composeNotifyData } from "./common/composeNotifyData";
import { ServicesData } from "./common/ServicesData";

export const ServicesNotifyData = {
  SERVICE_COMMAND_DISPATCHING: composeNotifyData(ServicesData.SERVICE_COMMAND_DISPATCHING),
  SERVICE_CONNECTED: composeNotifyData(ServicesData.SERVICE_CONNECTED),
  SERVICE_CREATED: composeNotifyData(ServicesData.SERVICE_CREATED),
};
