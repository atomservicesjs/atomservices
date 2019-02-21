export class ExtendException extends Error {
  public code: string;

  constructor(code: string, name: string, message: string, ext: object = {}) {
    super(`[code: '${code}'] - ${message}`);

    this.name = name;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
    Object.assign(this, ext);
  }
}
