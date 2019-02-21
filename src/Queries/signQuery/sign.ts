import { IQuery } from "atomservicescore";
import { hashify } from "./hashify";
import { reducer } from "./reducer";

export interface IQuerySigned extends IQuery {
  scope: string;
  type: string;
  _signature: string;
}

export const sign = (query: any, type: string, scope: string): IQuerySigned => {
  const combined: any = query;
  combined.scope = scope;
  combined.type = type;

  const reduced = reducer(combined);
  const stringify = JSON.stringify(reduced);
  reduced._signature = hashify(stringify);

  return reduced;
};
