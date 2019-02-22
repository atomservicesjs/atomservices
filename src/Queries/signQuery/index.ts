import { sign } from "./sign";
import { tokenize } from "./tokenize";
import { verify } from "./verify";

export const signQuery = {
  sign,
  tokenize,
  verify,
};

Object.freeze(signQuery);
