import { EventStream, IServiceDefinition } from "atomservicescore";
import { composeReactions } from "../../Reactions/composeReactions";
import { composeServiceContext } from "./composeServiceContext";

export const composeEventReactions = (definition: IServiceDefinition): EventStream.IReactStreamProcesses => ((Definition): EventStream.IReactStreamProcesses => {
  const Reactions = composeReactions(...Definition.Reactions)(Definition.type);
  const ServiceContextComposing = composeServiceContext(Definition);
  const scopes: string[] = Definition.Reactions.reduce((result, each) => {
    if (result.indexOf(each.scope) < 0) {
      result.push(each.scope);
    }

    return result;
  }, [] as string[]);

  return scopes.reduce((result, scope) => {
    const processing: EventStream.StreamProcessing = async (event, metadata, processAck) => {
      const reactions = Reactions.resolve(event, scope);
      const reacts = [];

      for (const reaction of reactions) {
        const ServiceContext = ServiceContextComposing(metadata);
        reacts.push(reaction.react(event, ServiceContext, metadata));
      }

      await Promise.all(reacts);

      await processAck();
    };

    result[scope] = processing;

    return result;
  }, {} as EventStream.IReactStreamProcesses);
})(definition);
