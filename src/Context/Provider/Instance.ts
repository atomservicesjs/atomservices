import { IContextProvider } from "atomservicescore";

let Instance: any;

export const getInstance = (): IContextProvider => Instance;
export const setInstance = (provider: IContextProvider) => Instance = provider;
