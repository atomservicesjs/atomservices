import { IConstantData } from "./IConstantData";

const type = "Containers";

export const ContainersData = {
  CONTAINER_CONNECTED: { action: "CONTAINER_CONNECTED", level: "info", message: "[Container: $$NAME$$] Connected", type } as IConstantData,
  CONTAINER_CREATED: { action: "CONTAINER_CREATED", level: "info", message: "[Container: $$NAME$$] Created", type } as IConstantData,
};
