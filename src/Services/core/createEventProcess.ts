import { EventStreams, IEvent, IServiceContext } from "atomservicescore";
import { IEventHandlers } from "../../Events/IEventHandlers";
import { IStateRepository } from "../../IStateRepository";
import { composeProcessResult } from "./composeProcessResult";
import { StateQueryResult } from "./StateQueryResult";

export const createEventProcess = (
  EventHandlers: IEventHandlers,
  Repository: IStateRepository,
  ServiceContext: IServiceContext,
): EventStreams.EventProcess => async (event: IEvent, ack: EventStreams.EventProcessAck) => {
  const scope = ServiceContext.scope();
  const stateResult = StateQueryResult({
    action: "process",
    name: event.name,
    ref: event._id,
    scope,
    type: event.type,
  });

  try {
    const handler = EventHandlers.resolve(event);

    if (handler === undefined) {
      await ServiceContext.directTo(event._id, stateResult.unhandled());
    } else {
      const initState = await Repository.queryByID(event.aggregateID);
      const state = await Repository.applyEvent(initState, event, handler.process);

      if (handler.processEffect !== undefined) {
        await handler.processEffect(
          { event, initState, state },
          composeProcessResult(ServiceContext, stateResult),
          ServiceContext,
        );
      }
    }

    ack();
  } catch (error) {
    await ServiceContext.directTo(event._id, stateResult.error(error));
  }
};

Object.freeze(createEventProcess);
