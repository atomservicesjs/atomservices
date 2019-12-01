import { IServiceDefinition } from "atomservicescore";

export const mapReactionsEvents = (definition: IServiceDefinition): Array<{ scope: string; type: string; name: string; }> =>
  definition.Reactions.map(({ scope, type, name }) => ({ scope, type, name }));
