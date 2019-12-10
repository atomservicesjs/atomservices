import { composeNotifyData } from "./common/composeNotifyData";
import { ServicesData } from "./common/ServicesData";

export const ServicesNotifyData = {
  SERVICE_COMMAND_DISPATCHING: composeNotifyData(ServicesData.SERVICE_COMMAND_DISPATCHING),
  SERVICE_COMMAND_INVALID: composeNotifyData(ServicesData.SERVICE_COMMAND_INVALID),
  SERVICE_COMMAND_UNHANDLED: composeNotifyData(ServicesData.SERVICE_COMMAND_UNHANDLED),
  SERVICE_CONNECTED: composeNotifyData(ServicesData.SERVICE_CONNECTED),
  SERVICE_CREATED: composeNotifyData(ServicesData.SERVICE_CREATED),
};
