export type DispatchStatus = "accepted" | "invalid" | "unhandled";

export interface IAcceptDispatchResult {
  accept: boolean;
  status: DispatchStatus;
  ref: {
    _id: any;
    type: string;
    name: string;
    aggregateID: any;
    _version: number;
    _createdAt: Date;
  };
}

export interface IInvalidDispatchResult {
  accept: boolean;
  status: DispatchStatus;
  invalidAttributes: any;
}

export interface IUnhandledDispatchResult {
  accept: boolean;
  status: DispatchStatus;
  type: string;
  name: string;
}

export type DispatchResultType =
  IAcceptDispatchResult |
  IInvalidDispatchResult |
  IUnhandledDispatchResult;
