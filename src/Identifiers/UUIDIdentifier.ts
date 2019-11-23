import { IIdentifier } from "atomservicescore";
import * as UUID from "uuid";

export const UUIDIdentifier: IIdentifier<string, string> = {
  AggregateID: () => UUID.v4(),
  EventID: () => UUID.v4(),
};

Object.freeze(UUIDIdentifier);
