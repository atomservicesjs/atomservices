import { IEvent, IStateBase } from "atomservicescore";
import { cloneDeep } from "./cloneDeep";

export const stampState = (state: IStateBase, event: IEvent) => {
  const cloned = cloneDeep(state);
  cloned._updatedAt = event._createdAt;
  cloned._updatedBy = event._createdBy;
  cloned._version = event._version;

  return cloned;
};

Object.freeze(stampState);
