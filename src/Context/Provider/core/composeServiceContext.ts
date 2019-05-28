import {
  IEventStream,
  IServiceConfigs,
  IServiceContext,
} from "atomservicescore";
import { composeServiceEventStream } from "../../Service/EventStream";
import { composeServiceLevels } from "../../Service/Levels/composeServiceLevels";

export const composeServiceContext = (stream: IEventStream) =>
  (type: string, scope: string, configs?: IServiceConfigs): IServiceContext => ((
    EventStream,
    Configs,
  ): IServiceContext => {
    const ServiceLevels = composeServiceLevels(Configs || {});
    const ServiceStream = composeServiceEventStream(EventStream)(type, scope, configs);

    return {
      directTo: (ref, data) =>
        ServiceStream.directTo(ref, data),
      dispatch: (event) =>
        ServiceStream.dispatch(event),
      level: (name) =>
        ServiceLevels.level(name),
      listenTo: (ref, listener) =>
        ServiceStream.listenTo(ref, listener),
      registerHandler: (handler, process) =>
        ServiceStream.registerHandler(handler, process),
      registerReaction: (reaction, process) =>
        ServiceStream.registerReaction(reaction, process),
      scope: () =>
        scope,
      type: () =>
        type,
    };
  })(stream, configs);

Object.freeze(composeServiceContext);
