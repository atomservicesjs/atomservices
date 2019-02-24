import { IContextProvider, IEventStores, IEventStream, IIdentifier } from "atomservicescore";
import { composeServiceContext } from "./core/composeServiceContext";

const DefaultScope = "GLOBAL";

export const compose = (
  EventStores: IEventStores,
  EventStream: IEventStream,
  Identifier: IIdentifier,
): IContextProvider =>
  ((stores, stream, identifier): IContextProvider => {
    const ServiceContextComposer = composeServiceContext(stores, stream, identifier);

    return {
      identifier: () => identifier,
      provide: (type, configs) => ServiceContextComposer(type, DefaultScope, configs),
    };
  })(EventStores, EventStream, Identifier);

Object.freeze(compose);
