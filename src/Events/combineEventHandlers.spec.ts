import { expect } from "chai";
import * as sinon from "sinon";
import { combineEventHandlers } from "./combineEventHandlers";

describe("combineEventHandlers.ts tests", () => {
  describe("#combineEventHandlers()", () => {
    it("expect to combine the event handlers", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };

      // acts
      const combine = combineEventHandlers(handler);

      // asserts
      expect(combine).not.to.equal(null);
      expect(combine).not.to.equal(undefined);
      expect(typeof combine).to.equal("function");
    });

    it("expect to throw an error when combine the duplicate handlers", () => {
      // arranges
      const handler1: any = {
        name: "duplicated",
      };
      const handler2: any = {
        name: "duplicated",
      };

      // acts
      const combine = combineEventHandlers(handler1, handler2);
      const act = () => combine("type");

      // asserts
      expect(act).to.throw(Error, undefined, "[code: '000002'] - { type: test, name: duplicated }");
    });
  });

  describe("#EventHandlers.forEach()", () => {
    it("expect the callback get no called as no handlers", () => {
      // arranges
      const handlers = combineEventHandlers()("any.type");
      const callback = sinon.spy();

      // acts
      handlers.forEach(callback);

      // asserts
      expect(callback.callCount).to.equal(0);
    });

    it("expect to call the callback with handlers", () => {
      // arranges
      const handler1: any = {
        name: "sample1",
      };
      const handler2: any = {
        name: "sample2",
      };
      const handlers = combineEventHandlers(handler1, handler2)("any.type");
      const callback = sinon.spy();

      // acts
      handlers.forEach(callback);

      // asserts
      expect(callback.getCall(0).calledWith(handler1)).to.equal(true);
      expect(callback.getCall(1).calledWith(handler2)).to.equal(true);
    });
  });

  describe("#EventHandlers.resolve()", () => {
    it("expect to resolve a handler", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };
      const handlers = combineEventHandlers(handler)("any.type");
      const event: any = {
        name: "sample",
      };

      // acts
      const result = handlers.resolve(event);

      // asserts
      expect(result).to.equal(handler);
    });

    it("expect to get undefined when the event cannot resolve", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };
      const handlers = combineEventHandlers(handler)("any.type");
      const event: any = {
        name: "other",
      };

      // acts
      const result = handlers.resolve(event);

      // asserts
      expect(result).to.equal(undefined);
    });
  });

  describe("#EventHandlers.type()", () => {
    it("expect to get a type", () => {
      // arranges
      const handlers = combineEventHandlers()("any.type");

      // acts
      const result = handlers.type();

      // asserts
      expect(result).to.equal("any.type");
    });
  });
});
