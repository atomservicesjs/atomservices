import { ICommand } from "atomservicescore";

export const createCommand = <Payloads = any, CreatedBy = any>(
  name: string,
  payloads: Payloads,
  version: number,
  createdAt: Date,
  createdBy: CreatedBy,
): ICommand<Payloads, CreatedBy> => {
  const command: ICommand<Payloads, CreatedBy> = Object.defineProperties({}, {
    _createdAt: {
      configurable: false,
      enumerable: true,
      value: createdAt,
      writable: false,
    },
    _createdBy: {
      configurable: false,
      enumerable: true,
      value: createdBy,
      writable: false,
    },
    _version: {
      configurable: false,
      enumerable: true,
      value: version,
      writable: false,
    },
    name: {
      configurable: false,
      enumerable: true,
      value: name,
      writable: false,
    },
    payloads: {
      configurable: false,
      enumerable: true,
      value: payloads,
      writable: false,
    },
  });

  return command;
};

Object.freeze(createCommand);
