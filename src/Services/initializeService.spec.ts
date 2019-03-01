import { expect } from "chai";
import * as sinon from "sinon";
import { initializeService } from "./initializeService";

describe("initializeService.ts tests", () => {
  describe("#initializeService.description()", () => {
    it("expect to get a description", async () => {
      // arranges
      const scope = "scope";
      const type = "type";
      const CommandHandlers: any = {
        forEach: (cb: (v: any) => void) => {
          [
            { name: "commandA" },
            { name: "commandB" },
            { name: "commandC" },
          ].forEach((each) => cb(each));
        },
      };
      const EventHandlers: any = {
        forEach: (cb: (v: any) => void) => {
          [
            { name: "name1", type: "type", scope: "scope", level: "public" },
            { name: "name3", type: "type", scope: "scope", level: "public" },
            { name: "name5", type: "type", scope: "scope", level: "scope" },
            { name: "name2", type: "type", scope: "scope", level: "public" },
            { name: "name4", type: "type", scope: "scope", level: "scope" },
          ].forEach((each) => cb(each));
        },
      };
      const Reactions: any = {
        forEach: (cb: (v: any) => void) => {
          [
            { name: "name1", type: "typeA", scope: "side", level: "public" },
            { name: "name1", type: "typeB", scope: "side", level: "public" },
            { name: "name2", type: "typeA", scope: "side", level: "public" },
            { name: "name2", type: "typeB", scope: "side", level: "public" },
            { name: "name3", type: "typeB", scope: "side", level: "public" },
          ].forEach((each) => cb(each));
        },
      };
      const EventProcess = sinon.spy();
      const ReactionProcess = sinon.spy();
      const ServiceContext: any = {
        registerHandler: (val: any) => Promise.resolve(val),
        registerReaction: (val: any) => Promise.resolve(val),
      };

      const expected = {
        commands: ["commandA", "commandB", "commandC"],
        handlers: [
          { level: "public", name: "name1" },
          { level: "public", name: "name2" },
          { level: "public", name: "name3" },
          { level: "scope", name: "name4" },
          { level: "scope", name: "name5" },
        ],
        reactions: [
          { name: "name1", scope: "side", type: "typeA" },
          { name: "name2", scope: "side", type: "typeA" },
          { name: "name1", scope: "side", type: "typeB" },
          { name: "name2", scope: "side", type: "typeB" },
          { name: "name3", scope: "side", type: "typeB" },
        ],
        scope: "scope",
        type: "type",
      };

      // acts
      const register = await initializeService(
        scope,
        type,
        {
          CommandHandlers,
          EventHandlers,
          Reactions,
        },
        {
          EventProcess,
          ReactionProcess,
        },
        ServiceContext,
      );
      const description = register.description();

      // asserts
      expect(description).to.deep.equal(expected);
    });
  });

  describe("#initializeService.asSubscribers()", () => {
    it("expect to get subscribers", async () => {
      // arranges
      const scope = "scope";
      const type = "type";
      const CommandHandlers: any = {
        forEach: (cb: (v: any) => void) => {
          [
            { name: "commandA" },
            { name: "commandB" },
            { name: "commandC" },
          ].forEach((each) => cb(each));
        },
      };
      const EventHandlers: any = {
        forEach: (cb: (v: any) => void) => {
          [
            { name: "name1", type: "type", scope: "scope", level: "public" },
            { name: "name3", type: "type", scope: "scope", level: "public" },
            { name: "name5", type: "type", scope: "scope", level: "scope" },
            { name: "name2", type: "type", scope: "scope", level: "public" },
            { name: "name4", type: "type", scope: "scope", level: "scope" },
          ].forEach((each) => cb(each));
        },
      };
      const Reactions: any = {
        forEach: (cb: (v: any) => void) => {
          [
            { name: "name1", type: "typeA", scope: "side", level: "public" },
            { name: "name1", type: "typeB", scope: "side", level: "public" },
            { name: "name2", type: "typeA", scope: "side", level: "public" },
            { name: "name2", type: "typeB", scope: "side", level: "public" },
            { name: "name3", type: "typeB", scope: "side", level: "public" },
          ].forEach((each) => cb(each));
        },
      };
      const EventProcess = sinon.spy();
      const ReactionProcess = sinon.spy();
      const ServiceContext: any = {
        registerHandler: (val: any) => Promise.resolve(val),
        registerReaction: (val: any) => Promise.resolve(val),
      };

      const expected = {
        asSubscribers: [
          { name: "name1", type: "type", scope: "scope", level: "public" },
          { name: "name2", type: "type", scope: "scope", level: "public" },
          { name: "name3", type: "type", scope: "scope", level: "public" },
          { name: "name4", type: "type", scope: "scope", level: "scope" },
          { name: "name5", type: "type", scope: "scope", level: "scope" },
          { name: "name1", type: "typeA", scope: "side", level: "public" },
          { name: "name2", type: "typeA", scope: "side", level: "public" },
          { name: "name1", type: "typeB", scope: "side", level: "public" },
          { name: "name2", type: "typeB", scope: "side", level: "public" },
          { name: "name3", type: "typeB", scope: "side", level: "public" },
        ],
        scope: "scope",
        type: "type",
      };

      // acts
      const register = await initializeService(
        scope,
        type,
        {
          CommandHandlers,
          EventHandlers,
          Reactions,
        },
        {
          EventProcess,
          ReactionProcess,
        },
        ServiceContext,
      );
      const subscribers = register.asSubscribers();

      // asserts
      expect(subscribers).to.deep.equal(expected);
    });
  });
});
