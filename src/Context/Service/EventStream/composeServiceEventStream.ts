import { IEventStream, IServiceConfigs, IServiceEventStream } from "atomservicescore";
import { composeServiceLevels } from "../Levels/composeServiceLevels";

export const composeServiceEventStream = (stream: IEventStream) =>
  (type: string, scope: string, configs: IServiceConfigs = {}): IServiceEventStream =>
    ((Stream, Type, Scope, Configs): IServiceEventStream => {
      const ServiceLevels = composeServiceLevels(Configs);

      return {
        directTo: (ref, data) =>
          Stream.directTo(ref, data),
        dispatch: (event) =>
          Stream.publish(event, {
            level: ServiceLevels.level(event.name),
            scope: Scope,
          }),
        listenTo: (ref, listener) =>
          Stream.listenTo(ref, listener),
        registerHandler: (handler, process) =>
          Stream.subscribe(
            {
              level: ServiceLevels.level(handler.name),
              name: handler.name,
              scope: Scope,
              type: Type,
            },
            {
              channel: "handler",
              scope: Scope,
              type: Type,
            },
            process,
          ),
        registerReaction: (reaction, process) =>
          Stream.subscribe(
            {
              level: (reaction.scope === Scope && reaction.type === Type) ? ServiceLevels.level(reaction.name) : "public",
              name: reaction.name,
              scope: Scope,
              type: Type,
            },
            {
              channel: "reaction",
              scope: Scope,
              type: Type,
            },
            process,
          ),
      };
    })(stream, type, scope, configs);
