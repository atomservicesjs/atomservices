import { IQuery } from "atomservicescore";
import { hashify } from "./common/hashify";
import { reducize } from "./common/reducize";

export const tokenize = (query: IQuery, type: string, scope: string): string => {
  const typedQuery = Object.assign({}, query, { type, scope });
  const reduced = reducize(typedQuery);
  const stringify = JSON.stringify(reduced);

  return hashify(stringify);
};

Object.freeze(tokenize);
