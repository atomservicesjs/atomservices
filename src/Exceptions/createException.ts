import { ExtendException } from "./ExtendException";

export const createException = (meta: { code: string; name: string; }, message: string, ext: object = {}) =>
  new ExtendException(meta.code, meta.name, message, ext);
