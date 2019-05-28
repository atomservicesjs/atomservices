import { IEventStream, IServiceConfigs, IServiceEventStream } from "atomservicescore";
import { composeServiceLevels } from "../Levels";

export const composeServiceEventStream = (stream: IEventStream) =>
  (type: string, scope: string, configs: IServiceConfigs = {}): IServiceEventStream =>
    ((EventStream, Type, Scope, Configs): IServiceEventStream => {
      const ServiceLevels = composeServiceLevels(Configs);

      return {
        directTo: (ref, data) =>
          EventStream.directTo(ref, data),
        dispatch: (event) =>
          EventStream.publish(event, {
            level: ServiceLevels.level(event.name),
            scope: Scope,
          }),
        listenTo: (ref, listener) =>
          EventStream.listenTo(ref, listener),
        registerHandler: (handler, process) =>
          EventStream.subscribe(
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
          EventStream.subscribe(
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
