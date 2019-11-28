import { IServiceDefinition } from "atomservicescore";

export type IStreamConnect = (definition: IServiceDefinition) => Promise<void>;
