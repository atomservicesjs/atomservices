import { DispatchResult as DispatchResultType, IEvent } from "atomservicescore";

export const DispatchResult = {
  accept: (event: IEvent, ext: { [key: string]: any; } = {}): DispatchResultType.IAcceptDispatchResult =>
    ({
      accept: true,
      ref: {
        _createdAt: event._createdAt,
        _id: event._id,
        _version: event._version,
        aggregateID: event.aggregateID,
        name: event.name,
        type: event.type,
        ...ext,
      },
      status: "accepted",
    }),
  invalid: (invalidAttributes: any): DispatchResultType.IInvalidDispatchResult =>
    ({
      accept: false,
      invalidAttributes,
      status: "invalid",
    }),
  unhandled: (type: string, name: string): DispatchResultType.IUnhandledDispatchResult =>
    ({
      accept: false,
      name,
      status: "unhandled",
      type,
    }),
};

Object.freeze(DispatchResult);
