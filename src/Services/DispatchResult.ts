import { Services } from "atomservicescore";

export const DispatchResult = {
  accept: (ref: any): Services.IAcceptDispatchResult =>
    ({ accept: true, ref, status: "accepted" }),
  invalid: (invalidAttributes: any): Services.IInvalidDispatchResult =>
    ({ accept: false, status: "invalid", invalidAttributes }),
  unhandled: (type: string, name: string): Services.IUnhandledDispatchResult =>
    ({ accept: false, status: "unhandled", type, name }),
};
