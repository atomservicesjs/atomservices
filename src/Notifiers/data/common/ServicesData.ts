import { IConstantData } from "./IConstantData";

const type = "Services";

export const ServicesData = {
  SERVICE_COMMAND_DISPATCHING: { action: "SERVICE_COMMAND_DISPATCHING", level: "info", message: "[Service: $$NAME$$] Command Dispatching", type } as IConstantData,
  SERVICE_COMMAND_ERROR: { action: "SERVICE_COMMAND_ERROR", level: "error", message: "[Service: $$NAME$$] Command Dispatching Error", type } as IConstantData,
  SERVICE_COMMAND_INVALID: { action: "SERVICE_COMMAND_INVALID", level: "warn", message: "[Service: $$NAME$$] Command Invalid", type } as IConstantData,
  SERVICE_COMMAND_UNHANDLED: { action: "SERVICE_COMMAND_UNHANDLED", level: "warn", message: "[Service: $$NAME$$] Command Unhandled", type } as IConstantData,
  SERVICE_CONNECTED: { action: "SERVICE_CONNECTED", level: "info", message: "[Service: $$NAME$$] Connected", type } as IConstantData,
  SERVICE_CREATED: { action: "SERVICE_CREATED", level: "info", message: "[Service: $$NAME$$] Created", type } as IConstantData,
  SERVICE_EVENT_DISPATCHED: { action: "SERVICE_EVENT_DISPATCHED", level: "info", message: "[Service: $$NAME$$] Event Dispatched", type } as IConstantData,
  SERVICE_EVENT_HANDLED: { action: "SERVICE_EVENT_HANDLED", level: "info", message: "[Service: $$NAME$$] Event Handled", type } as IConstantData,
  SERVICE_EVENT_REACTED: { action: "SERVICE_EVENT_REACTED", level: "info", message: "[Service: $$NAME$$] Event Reacted", type } as IConstantData,
  SERVICE_EVENT_UNHANDLED_ERROR: { action: "SERVICE_EVENT_UNHANDLED_ERROR", level: "error", message: "[Service: $$NAME$$] Event Unhandled Error", type } as IConstantData,
};
