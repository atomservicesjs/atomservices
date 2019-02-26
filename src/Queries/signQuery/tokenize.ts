import { common, IQuery } from "atomservicescore";

export const tokenize = (query: IQuery, type: string, scope: string): string => {
  const typedQuery = Object.assign({}, query, { type, scope });
  const reduced = common.reducize(typedQuery);
  const stringify = JSON.stringify(reduced);

  return common.hashify(stringify);
};

Object.freeze(tokenize);
