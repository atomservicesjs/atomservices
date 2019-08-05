import { IExtendException } from "./IExtendException";

export class ExtendException extends Error implements IExtendException {
  public code: string;
  public description: string;

  constructor(code: string, name: string, description: string, ext: object = {}) {
    super(`['${code}'-${name}] : ${description}`);

    this.code = code;
    this.name = name;
    this.description = description;

    Error.captureStackTrace(this, this.constructor);
    Object.assign(this, ext);
  }
}
