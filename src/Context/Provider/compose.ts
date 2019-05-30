import { IContextProvider, IEventStores, IEventStream, IIdentifier } from "atomservicescore";
import { composeServiceContext } from "./core/composeServiceContext";
import { setInstance } from "./Instance";

const DefaultScope = "GLOBAL";

export type ComposeEventStoresType<ComposeEventStoresOptions = any> = (options?: ComposeEventStoresOptions) => IEventStores;
export type ComposeEventStreamType<ComposeEventStreamOptions = any> = (options?: ComposeEventStreamOptions) => IEventStream;
export type ComposeIdentifierType<ComposeIdentifierOptions = any> = (options?: ComposeIdentifierOptions) => IIdentifier;

export const compose = (
  composers: {
    composeEventStream: (options?: any) => IEventStream;
    composeIdentifier: (options?: any) => IIdentifier;
  },
  options: {
    eventStream?: any;
    identifier?: any;
  } = {},
  persistInstance: boolean = true,
): IContextProvider => {
  const { composeEventStream, composeIdentifier } = composers;

  const EventStream = composeEventStream(options.eventStream);
  const Identifier = composeIdentifier(options.identifier);

  return ((stream, identifier): IContextProvider => {
    const ServiceContextComposer = composeServiceContext(stream, identifier);

    const ContextProvider: IContextProvider = {
      provide: (type, configs) => ServiceContextComposer(type, DefaultScope, configs),
    };

    if (persistInstance) {
      setInstance(ContextProvider);
    }

    return ContextProvider;
  })(EventStream, Identifier);
};

Object.freeze(compose);
