import { EventStreams, IEvent, IServiceContext, IStateQueryResult } from "atomservicescore";
import { IEventHandlers } from "../../Events/IEventHandlers";
import { IStateRepository } from "../../IStateRepository";
import { StateQueryResult } from "./StateQueryResult";

const composeProcessResult = (context: IServiceContext, qr: { success: (state: any) => IStateQueryResult; }) =>
  (event: IEvent, result: any) => context.toRef(event._id, qr.success(result));

export const createEventProcess = (
  EventHandlers: IEventHandlers,
  Repository: IStateRepository,
  ServiceContext: IServiceContext,
) => async (event: IEvent, ack: EventStreams.SubscribeAckFunc) => {
  const scope = ServiceContext.scope();
  const qr = StateQueryResult({
    action: "process",
    name: event.name,
    ref: event._id,
    scope,
    type: event.type,
  });

  try {
    const handler = EventHandlers.resolve(event);

    if (handler === undefined) {
      await ServiceContext.toRef(event._id, qr.unhandled());
    } else {
      const initState = await Repository.queryByID(event.aggregateID);
      const state = await Repository.applyEvent(initState, event, handler.process);

      if (handler.processEffect !== undefined) {
        await handler.processEffect(
          { event, initState, state },
          composeProcessResult(ServiceContext, qr),
          ServiceContext,
        );
      }
    }

    ack();
  } catch (error) {
    await ServiceContext.toRef(event._id, qr.error(error));
  }
};

Object.freeze(createEventProcess);
