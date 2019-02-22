import { IQuery } from "atomservicescore";
import { tokenize } from "./tokenize";

export const verify = (query: IQuery, type: string, scope: string, token: string): boolean =>
  tokenize(query, type, scope) === token;

Object.freeze(verify);
