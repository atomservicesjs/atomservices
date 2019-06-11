import { IEvent } from "atomservicescore";
import { IAcceptDispatchResult, IInvalidDispatchResult, IUnhandledDispatchResult } from "./DispatchResultType";

export const DispatchResult = {
  accept: (event: IEvent): IAcceptDispatchResult =>
    ({
      accept: true,
      ref: {
        _createdAt: event._createdAt,
        _id: event._id,
        _version: event._version,
        aggregateID: event.aggregateID,
        name: event.name,
        type: event.type,
      },
      status: "accepted",
    }),
  invalid: (invalidAttributes: any): IInvalidDispatchResult =>
    ({
      accept: false,
      invalidAttributes,
      status: "invalid",
    }),
  unhandled: (type: string, name: string): IUnhandledDispatchResult =>
    ({
      accept: false,
      name,
      status: "unhandled",
      type,
    }),
};

Object.freeze(DispatchResult);
