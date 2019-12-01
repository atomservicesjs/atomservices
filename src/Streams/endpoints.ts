import { EventStream } from "atomservicescore";

export const endpoints = {
  toExchange: (on: { type: string; scope: string; level: EventStream.StreamLevel; }) =>
    `${on.scope}:${on.type}::${on.level}`,
  toQueue: (to: { type: string; scope: string; channel: EventStream.EventChannel; }) =>
    `${to.scope}:${to.type}::${to.channel}`,
};

Object.freeze(endpoints);
