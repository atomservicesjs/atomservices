import { EventStream, IServiceDefinition } from "atomservicescore";
import { ServicesNotifyData } from "../../Notifiers";
import { composeReactions } from "../../Reactions/composeReactions";
import { composeServiceContext } from "./composeServiceContext";
import { MetadataRefiner } from "./MetadataRefiner";

export const composeEventReactions = (definition: IServiceDefinition): EventStream.IReactStreamProcesses => ((Definition): EventStream.IReactStreamProcesses => {
  const Reactions = composeReactions(...Definition.Reactions)(Definition.type);
  const ServiceContextComposing = composeServiceContext(Definition);
  const scopes: string[] = Definition.Reactions.reduce((result, each) => {
    if (result.indexOf(each.scope) < 0) {
      result.push(each.scope);
    }

    return result;
  }, [] as string[]);
  const { Notifiers } = Definition;

  return scopes.reduce((result, scope) => {
    const processing: EventStream.StreamProcessing = async (event, metadata, processAck) => {
      const reacts = [];
      const reactions = Reactions.resolve(event, scope);
      metadata = MetadataRefiner.consume(metadata);

      for (const reaction of reactions) {
        const ServiceContext = ServiceContextComposing(metadata);
        reacts.push(reaction.react(event, ServiceContext, metadata));
      }

      await Promise.all(reacts);

      if (reacts.length) {
        Notifiers.emit(ServicesNotifyData.SERVICE_EVENT_REACTED(Definition.type, {
          service: {
            scope: Definition.scope,
            type: Definition.type,
          },
          // tslint:disable-next-line: object-literal-sort-keys
          event: {
            eventID: event._id,
            scope,
            type: event.type,
            // tslint:disable-next-line: object-literal-sort-keys
            name: event.name,
            aggregateID: event.aggregateID,
            _createdAt: event._createdAt,
            _createdBy: event._createdBy,
            _version: event._version,
          },
        }, {
          event,
        }));
      }
      await processAck();
    };

    result[scope] = processing;

    return result;
  }, {} as EventStream.IReactStreamProcesses);
})(definition);
