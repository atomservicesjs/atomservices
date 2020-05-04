import {
  ICommand,
  IEvent,
  ISFComponents,
  IServiceIdentifier,
  IValidationResultType,
  EventHandler,
  EventProcessType,
  EventStream,
  EventVersioning,
} from "atomservicescore";

export const createSFComponents = <Event extends IEvent = IEvent, Command extends ICommand = ICommand<Event["payloads"], Event["_createdBy"]>, ProcessResult = any>(structure: {
  configs?: {
    level?: EventStream.StreamLevel;
    processType?: EventProcessType;
    versioning?: EventVersioning;
  };
  event: {
    name: string;
    process: EventHandler.EventProcessHandle<Event, ProcessResult>;
    processEffect?: EventHandler.EventProcessEffectHandle<Event, ProcessResult>;
  };
  command?: {
    name?: string;
    validate?: (command: Command) => IValidationResultType;
    transform?: (command: Command, identifier: IServiceIdentifier<Event["aggregateID"], Event["_id"]>) => Event;
  };
  state?: {
    apply?: (event: Event) => Promise<void>;
  };
}) => {
  const configs = structure.configs || {};
  const commandStruct = structure.command || {};
  const eventStruct = structure.event;
  const stateStruct = structure.state || {};

  const components: ISFComponents<Event, Command> = {
    Configs: {
      level: configs.level,
      processType: configs.processType,
      versioning: configs.versioning,
    },
    Commander: (props) => {
      const { _createdBy, _version, ...payloads } = props;

      const properties: any = {
        name: {
          configurable: false,
          enumerable: true,
          value: (structure.command && structure.command.name) || structure.event.name,
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
      name: commandStruct.name || eventStruct.name,
      transform: (command, identifier) => {
        if (commandStruct.transform) {
          return commandStruct.transform(command, identifier);
        } else {
          const { aggregateID, ...payloads } = command.payloads;
          const AggregateID = aggregateID || identifier.AggregateID()

          const eventProperties: any = {
            _id: {
              configurable: false,
              enumerable: true,
              value: identifier.EventID(),
              writable: false,
            },
            type: {
              configurable: false,
              enumerable: true,
              value: identifier.type(),
              writable: false,
            },
            name: {
              configurable: false,
              enumerable: true,
              value: eventStruct.name,
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
              value: command._createdBy || AggregateID,
              writable: false,
            },
          };

          if (command._version) {
            eventProperties._version = {
              configurable: false,
              enumerable: true,
              value: command._version,
              writable: false,
            };
          }

          return Object.defineProperties({}, eventProperties);
        }
      },
      validate: (command) => {
        if (commandStruct.validate) {
          return commandStruct.validate(command);
        } else {
          return {
            isValid: true,
          };
        }
      },
    },
    EventHandler: {
      name: eventStruct.name,
      process: eventStruct.process,
      processEffect: eventStruct.processEffect,
    },
    StateHandler: {
      name: eventStruct.name,
      apply: async (event) => {
        if (stateStruct.apply) {
          await stateStruct.apply(event);
        }
      },
    },
  };

  return components;
};
