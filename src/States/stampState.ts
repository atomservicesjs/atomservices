import { IEvent, IStateBase } from "atomservicescore";
import { cloneDeep } from "./cloneDeep";

export const stampState = <State extends IStateBase = IStateBase>(state: State, event: IEvent): State => {
  const cloned = cloneDeep(state);
  cloned._updatedAt = event._createdAt;
  cloned._version = event._version;

  if (event._createdBy) {
    cloned._updatedBy = event._createdBy;
  }

  return cloned;
};

Object.freeze(stampState);
