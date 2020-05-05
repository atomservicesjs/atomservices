import { IServiceDefinition } from "atomservicescore";
import { composeCommandHandlers } from "../../Commands/composeCommandHandlers";
import { DispatchResult } from "../../Commands/DispatchResult";
import { ICommandDispatcher } from "../../Commands/ICommandDispatcher";
import { LocalDirectStream } from "../../Streams";
import { composeServiceContext } from "./composeServiceContext";

export const createCommandDispatcher = (definition: IServiceDefinition): ICommandDispatcher => ((Definition) => {
  const { ServiceConfigurate, type } = Definition;
  const CommandHandlers = composeCommandHandlers(...Definition.CommandHandlers)(type);
  const ServiceContextComposing = composeServiceContext(Definition);

  const CommandDispatcher: ICommandDispatcher = {
    dispatch: async (command, listening) => {
      const { name } = command;

      try {
        const CommandHandler = CommandHandlers.resolve(command);

        if (CommandHandler === undefined) {
          // #UNHANDLED: Command Handler
          return DispatchResult.unhandled(type, name);
        } else {
          // #DISPATCH PROCESS: Validate Command
          const { invalidAttributes, isValid } = CommandHandler.validate(command);

          if (!isValid) {
            return DispatchResult.invalid(invalidAttributes);
          }

          const ServiceContext = ServiceContextComposing({ isReplay: false });
          const event = CommandHandler.transform(command, ServiceContext);

          // #DISPATCH PROCESS: Apply LISTENING
          if (listening) {
            const processType = ServiceConfigurate.processType(event.name);

            if (processType === "synchronous") {
              LocalDirectStream.listenTo(event._id, listening);
            } else {
              ServiceContext.listenTo(event._id, listening);
            }
          }

          await ServiceContext.dispatch(event);

          return DispatchResult.accept({
            _createdAt: event._createdAt,
            _id: event._id,
            _version: event._version,
            aggregateID: event.aggregateID,
            name: event.name,
            type: event.type,
          });
        }
      } catch (error) {
        return DispatchResult.error(type, name, error);
      }
    },
    scope: () => Definition.scope,
    type: () => Definition.type,
  };

  return CommandDispatcher;
})(definition);
