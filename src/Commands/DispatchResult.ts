import { DispatchResult as DispatchResultType } from "atomservicescore";

export const DispatchResult = {
  accept: (
    ref: {
      _createdAt: Date;
      _id: any;
      _version: number | undefined;
      aggregateID: any;
      name: string;
      type: string;
    },
    ext: { [key: string]: any; } = {},
  ): DispatchResultType.IAcceptDispatchResult =>
    ({
      accept: true,
      ref: {
        _createdAt: ref._createdAt,
        _id: ref._id,
        _version: ref._version,
        aggregateID: ref.aggregateID,
        name: ref.name,
        type: ref.type,
        ...ext,
      },
      status: "accepted",
    }),
  error: (type: string, name: string, error: Error): DispatchResultType.IErrorDispatchResult =>
    ({
      accept: false,
      error,
      name,
      status: "error",
      type,
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
