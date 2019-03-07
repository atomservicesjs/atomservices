import { ICommand } from "atomservicescore";

export const CommandBuilder = <
  Command extends ICommand = ICommand,
  Payloads = any,
  CreatedBy = any,
  >(
    initial: {
      name: string;
      version?: number;
      createdBy?: CreatedBy;
    },
    payloads?: Payloads,
): Command => {
  let command = Object.defineProperty({}, "name", {
    configurable: false,
    enumerable: true,
    value: initial.name,
    writable: false,
  });

  if (initial.createdBy) {
    command = Object.defineProperty(command, "_createdBy", {
      configurable: false,
      enumerable: true,
      value: initial.createdBy,
      writable: false,
    });
  }

  if (initial.version) {
    command = Object.defineProperty(command, "_version", {
      configurable: false,
      enumerable: true,
      value: initial.version,
      writable: false,
    });
  }

  if (payloads) {
    command = Object.defineProperty(command, "payloads", {
      configurable: false,
      enumerable: true,
      value: payloads,
      writable: false,
    });
  }

  return command;
};
