import { IServiceContainer } from "atomservicescore";

export const createContainer = (scope: string): IServiceContainer =>
  ((Scope): IServiceContainer => Object.freeze({
    scope: () => Scope,
  }))(scope);
