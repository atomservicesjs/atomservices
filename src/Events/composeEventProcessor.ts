import { IEventHandler, IEventStream, IIdentifier, IServiceConfigs, IServiceContainer } from "atomservicescore";
import { composeEventHandlers } from "./composeEventHandlers";
import { IEventProcessor } from "./IEventProcessor";

export const composeEventProcessor = (
  scope: string | IServiceContainer,
  identifier: IIdentifier,
  stream: IEventStream,
) => (
  configs: IServiceConfigs,
  ...eventHandlers: IEventHandler[]
) => {
    const { type } = configs;
    const Scope: string = typeof scope === "string" ? scope : scope.scope();
    const EventHandlers = composeEventHandlers(...eventHandlers)(type);

    const Processor: IEventProcessor = {
      process: async (event) => {
        const Handler = EventHandlers.resolve(event);

        if (Handler) {
          const currentState = undefined;
          await Handler.process(event, currentState);
        }
      },
      scope: () => Scope,
      type: () => type,
    };

    Object.freeze(Processor);

    stream.subscribe(
      {
        level: "Public",
        name: "*",
        scope: Scope,
        type,
      }, {
        channel: "EventHandler",
        scope: Scope,
        type,
      },
      Processor.process,
    );

    return Processor;
  };

Object.freeze(composeEventProcessor);
