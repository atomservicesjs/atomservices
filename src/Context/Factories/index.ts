import { ServiceContextFactory } from "./ServiceContextFactory";
import { ServiceEventStreamFactory } from "./ServiceEventStreamFactory";
import { ServiceIdentifierFactory } from "./ServiceIdentifierFactory";
import { ServiceStreamLevelFactory } from "./ServiceStreamLevelFactory";

export const Factories = {
  ServiceContextFactory,
  ServiceEventStreamFactory,
  ServiceIdentifierFactory,
  ServiceStreamLevelFactory,
};

Object.freeze(Factories);
