import { ICommand } from "atomservicescore";

export const CommandBuilder = <
  Command extends ICommand = ICommand,
  Payloads = any,
  CreatedBy = any,
  >(
    composed: {
      name: string;
      version?: number;
      createdBy?: CreatedBy;
    },
    payloads?: Payloads,
): Command => {
  let command = Object.defineProperty({}, "name", {
    configurable: false,
    enumerable: true,
    value: composed.name,
    writable: false,
  });

  if (composed.createdBy) {
    command = Object.defineProperty(command, "_createdBy", {
      configurable: false,
      enumerable: true,
      value: composed.createdBy,
      writable: false,
    });
  }

  if (composed.version) {
    command = Object.defineProperty(command, "_version", {
      configurable: false,
      enumerable: true,
      value: composed.version,
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

Object.freeze(CommandBuilder);
