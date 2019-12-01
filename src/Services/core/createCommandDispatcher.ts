import { IServiceDefinition } from "atomservicescore";
import { composeCommandHandlers } from "../../Commands/composeCommandHandlers";
import { DispatchResult } from "../../Commands/DispatchResult";
import { ICommandDispatcher } from "../../Commands/ICommandDispatcher";
import { LocalDirectStream } from "../../Streams";
import { composeServiceContext } from "./composeServiceContext";

export const createCommandDispatcher = (definition: IServiceDefinition): ICommandDispatcher => ((Definition) => {
  const { ServiceStream, type } = Definition;
  const CommandHandlers = composeCommandHandlers(...Definition.CommandHandlers)(type);
  const ServiceContextComposing = composeServiceContext(Definition);

  const CommandDispatcher: ICommandDispatcher = {
    dispatch: async (command, listening) => {
      const CommandHandler = CommandHandlers.resolve(command);

      if (CommandHandler === undefined) {
        const { name } = command;

        return DispatchResult.unhandled(type, name);
      } else {
        const ServiceContext = ServiceContextComposing({ isReplay: false });

        // #HOOK: Apply Command Hook
        if (CommandHandler.hook.command) {
          command = await CommandHandler.hook.command(command);
        }

        let event = CommandHandler.transform(command, ServiceContext);

        // #HOOK: Apply Event Hook
        if (CommandHandler.hook.event) {
          event = await CommandHandler.hook.event(event);
        }

        // #LISTENING
        if (listening) {
          const processType = ServiceStream.processType(event.name);

          if (processType === "synchronous") {
            LocalDirectStream.listenTo(event._id, listening);
          } else {
            ServiceContext.listenTo(event._id, listening);
          }
        }

        await ServiceContext.dispatch(event);

        return DispatchResult.accept(event);
      }
    },
    scope: () => Definition.scope,
    type: () => Definition.type,
  };

  return CommandDispatcher;
})(definition);
