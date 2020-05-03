import {
  ICommand,
  IEvent,
  IServiceIdentifier,
  IValidationResultType,
  EventHandler,
} from "atomservicescore";
import { ISFComponents } from "./ISFComponents";

export const createSFComponents = <Event extends IEvent = IEvent, ProcessResult = any>(structure: {
  type: string;
  event: {
    name: string;
    process: EventHandler.EventProcessHandle<Event, ProcessResult>;
    processEffect?: EventHandler.EventProcessEffectHandle<Event, ProcessResult>;
  };
  command?: {
    name?: string;
    validate?: (command: ICommand<Event["payloads"], Event["_createdBy"]>) => IValidationResultType;
    transform?: (command: ICommand<Event["payloads"], Event["_createdBy"]>, identifier: IServiceIdentifier<Event["aggregateID"], Event["_id"]>) => Event;
  };
}) => {
  const typeStruct = structure.type;
  const commandStruct = structure.command || {};
  const eventStruct = structure.event;

  const command = commandStruct.name || eventStruct.name;
  const event = eventStruct.name;

  const components: ISFComponents<Event> = {
    Commander: (props) => {
      const { _createdBy, _version, ...payloads } = props;

      const properties: any = {
        name: {
          configurable: false,
          enumerable: true,
          value: command,
          writable: false,
        },
        payloads: {
          configurable: false,
          enumerable: true,
          value: payloads,
          writable: false,
        },
      };

      if (_createdBy) {
        properties._createdBy = {
          configurable: false,
          enumerable: true,
          value: _createdBy,
          writable: false,
        };
      }

      if (_version) {
        properties._version = {
          configurable: false,
          enumerable: true,
          value: _version,
          writable: false,
        };
      }

      return Object.defineProperties({}, properties);
    },
    CommandHandler: {
      name: command,
      transform: (cmd, identifier) => {
        if (commandStruct.transform) {
          return commandStruct.transform(cmd, identifier);
        } else {
          const { aggregateID, ...payloads } = cmd.payloads;
          const AggregateID = aggregateID || identifier.AggregateID()

          const properties: any = {
            _id: {
              configurable: false,
              enumerable: true,
              value: identifier.EventID(),
              writable: false,
            },
            type: {
              configurable: false,
              enumerable: true,
              value: typeStruct,
              writable: false,
            },
            name: {
              configurable: false,
              enumerable: true,
              value: event,
              writable: false,
            },
            aggregateID: {
              configurable: false,
              enumerable: true,
              value: AggregateID,
              writable: false,
            },
            payloads: {
              configurable: false,
              enumerable: true,
              value: payloads,
              writable: false,
            },
            _createdAt: {
              configurable: false,
              enumerable: true,
              value: new Date(),
              writable: false,
            },
            _createdBy: {
              configurable: false,
              enumerable: true,
              value: cmd._createdBy || AggregateID,
              writable: false,
            },
          };

          if (cmd._version) {
            properties._version = {
              configurable: false,
              enumerable: true,
              value: cmd._version,
              writable: false,
            };
          }

          return Object.defineProperties({}, properties);
        }
      },
      validate: (cmd) => {
        if (commandStruct.validate) {
          return commandStruct.validate(cmd);
        } else {
          return {
            isValid: true,
          };
        }
      },
    },
    EventHandler: {
      name: event,
      process: eventStruct.process,
      processEffect: eventStruct.processEffect,
    },
  };

  return components;
};
