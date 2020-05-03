import {
  ICommand,
  ICommandHandler,
  IEvent,
  IEventHandler,
} from "atomservicescore";

export interface ISFComponents<Event extends IEvent = IEvent, ProcessResult = any> {
  Commander: (props: {
    [prop in keyof Event["payloads"]]: Event["payloads"][prop];
  } & {
    aggregateID?: Event["aggregateID"];
    _createdBy?: Event["_createdBy"];
    _version?: Event["_version"];
    [key: string]: any;
  }) => ICommand<Event["payloads"], Event["_createdBy"]>;
  CommandHandler: ICommandHandler<ICommand<Event["payloads"], Event["_createdBy"]>, Event>;
  EventHandler: IEventHandler<Event, ProcessResult>;
};
