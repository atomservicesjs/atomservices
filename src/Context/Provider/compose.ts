import { IContextProvider, IEventStores, IEventStream, IIdentifier } from "atomservicescore";
import { composeServiceContext } from "./core/composeServiceContext";
import { setInstance } from "./Instance";

const DefaultScope = "GLOBAL";

export type ComposeEventStoresType<ComposeEventStoresOptions = any> = (options?: ComposeEventStoresOptions) => IEventStores;
export type ComposeEventStreamType<ComposeEventStreamOptions = any> = (options?: ComposeEventStreamOptions) => IEventStream;
export type ComposeIdentifierType<ComposeIdentifierOptions = any> = (options?: ComposeIdentifierOptions) => IIdentifier;

export const compose = (
  composers: {
    composeEventStores: (options?: any) => IEventStores;
    composeEventStream: (options?: any) => IEventStream;
    composeIdentifier: (options?: any) => IIdentifier;
  },
  options: {
    eventStores?: any;
    eventStream?: any;
    identifier?: any;
  } = {},
  persistInstance: boolean = true,
): IContextProvider => {
  const { composeEventStores, composeEventStream, composeIdentifier } = composers;

  const EventStores = composeEventStores(options.eventStores);
  const EventStream = composeEventStream(options.eventStream);
  const Identifier = composeIdentifier(options.identifier);

  return ((stores, stream, identifier): IContextProvider => {
    const ServiceContextComposer = composeServiceContext(stream);

    const ContextProvider: IContextProvider = {
      provide: (type, configs) => ServiceContextComposer(type, DefaultScope, configs),
    };

    if (persistInstance) {
      setInstance(ContextProvider);
    }

    return ContextProvider;
  })(EventStores, EventStream, Identifier);
};

Object.freeze(compose);
