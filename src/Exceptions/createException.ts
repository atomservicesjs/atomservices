import { ExtendException } from "./ExtendException";
import { IExtendException } from "./IExtendException";

export const createException = (composed: { code: string; name: string; }, description: string, ext: object = {}): IExtendException =>
  new ExtendException(composed.code, composed.name, description, ext);

Object.freeze(createException);
