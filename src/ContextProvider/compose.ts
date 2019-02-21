import { IContextProvider, IEventStores, IEventStream, IIdentifier } from "atomservicescore";
import { composeServiceContext } from "./core/composeServiceContext";

const DefaultScope = "GLOBAL";

export const compose = (stores: IEventStores, stream: IEventStream, identifier: IIdentifier): IContextProvider =>
  ((EventStores, EventStream, Identifier): IContextProvider => {
    const ServiceContextComposer = composeServiceContext(EventStores, EventStream, Identifier);

    return {
      identifier: () => Identifier,
      provide: (type, configs) => ServiceContextComposer(type, DefaultScope, configs),
    };
  })(stores, stream, identifier);

Object.freeze(compose);
