import { IIdentifier, IServiceIdentifier } from "atomservicescore";

export const composeServiceIdentifier = (identifier: IIdentifier) => (type: string): IServiceIdentifier =>
  ({
    newAggregateID: () => identifier.AggregateID(type),
    newEventID: () => identifier.EventID(type),
  });
