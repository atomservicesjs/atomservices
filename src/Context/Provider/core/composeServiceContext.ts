import {
  IEventStream,
  IIdentifier,
  IServiceConfigs,
  IServiceContext,
} from "atomservicescore";
import { composeServiceEventStream } from "../../Service/EventStream";
import { composeServiceIdentifier } from "../../Service/Identifier";
import { composeServiceLevels } from "../../Service/Levels/composeServiceLevels";

export const composeServiceContext = (stream: IEventStream, identifier: IIdentifier) =>
  (type: string, scope: string, configs?: IServiceConfigs): IServiceContext => ((
    EventStream,
    Identifier,
    Type,
    Scope,
    Configs,
  ): IServiceContext => {
    const ServiceLevels = composeServiceLevels(Configs || {});
    const ServiceStream = composeServiceEventStream(EventStream)(Type, Scope, Configs);
    const ServiceIdentifier = composeServiceIdentifier(Identifier)(Type);

    return {
      directTo: (ref, data) =>
        ServiceStream.directTo(ref, data),
      dispatch: (event) =>
        ServiceStream.dispatch(event),
      level: (name) =>
        ServiceLevels.level(name),
      listenTo: (ref, listener) =>
        ServiceStream.listenTo(ref, listener),
      newAggregateID: () => ServiceIdentifier.newAggregateID(),
      newEventID: () => ServiceIdentifier.newEventID(),
      registerHandler: (handler, process) =>
        ServiceStream.registerHandler(handler, process),
      registerReaction: (reaction, process) =>
        ServiceStream.registerReaction(reaction, process),
      scope: () =>
        Scope,
      type: () =>
        Type,
    };
  })(stream, identifier, type, scope, configs);

Object.freeze(composeServiceContext);
