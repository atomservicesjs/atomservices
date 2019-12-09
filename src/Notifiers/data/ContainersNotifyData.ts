import { composeNotifyData } from "./common/composeNotifyData";
import { ContainersData } from "./common/ContainersData";

export const ContainersNotifyData = {
  CONTAINER_CREATED: composeNotifyData(ContainersData.CONTAINER_CREATED),
};
