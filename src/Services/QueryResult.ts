import { Services } from "atomservicescore";

export const QueryResult = {
  accept: (ref: any): Services.IAcceptQueryResult =>
    ({ accept: true, ref, status: "accepted" }),
  invalid: (invalidAttributes: any): Services.IInvalidQueryResult =>
    ({ accept: false, status: "invalid", invalidAttributes }),
  unhandled: (type: string, name: string): Services.IUnhandledQueryResult =>
    ({ accept: false, status: "unhandled", type, name }),
};
