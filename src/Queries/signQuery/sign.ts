import { IQuery } from "atomservicescore";
import { tokenize } from "./tokenize";

export const sign = (query: IQuery, type: string, scope: string) => ({
  query,
  token: tokenize(query, type, scope),
});

Object.freeze(sign);
