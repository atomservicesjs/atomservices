/*
import { expect } from "chai";
import * as sinon from "sinon";
import { ExtendException } from "../Exceptions/ExtendException";
import { composeCommandHandlers } from "./composeCommandHandlers";

describe("Commands/composeCommandHandlers.ts tests", () => {
  describe("#composeCommandHandlers()", () => {
    it("expect to combine the command handlers", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };

      // acts
      const combine = composeCommandHandlers(handler);

      // asserts
      expect(combine).not.to.equal(null);
      expect(combine).not.to.equal(undefined);
      expect(combine).to.be.a("function");
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
      const combine = composeCommandHandlers(handler1, handler2);
      const act = () => combine("test");

      // asserts
      expect(act).to.throw(ExtendException);
    });
  });

  describe("#CommandHandlers.forEach()", () => {
    it("expect the callback get no called as no handlers", () => {
      // arranges
      const handlers = composeCommandHandlers()("any.type");
      const callback = sinon.spy();

      // acts
      const result = handlers.forEach(callback);

      // asserts
      expect(callback.callCount).to.equal(0);
      expect(result).to.equal(0);
    });

    it("expect to call the callback with handlers", () => {
      // arranges
      const handler1: any = {
        name: "sample1",
      };
      const handler2: any = {
        name: "sample2",
      };
      const handlers = composeCommandHandlers(handler1, handler2)("any.type");
      const callback = sinon.spy();

      // acts
      const result = handlers.forEach(callback);

      // asserts
      expect(callback.getCall(0).calledWith(handler1)).to.equal(true);
      expect(callback.getCall(1).calledWith(handler2)).to.equal(true);
      expect(result).to.equal(2);
    });
  });

  describe("#CommandHandlers.resolve()", () => {
    it("expect to resolve a handler", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };
      const handlers = composeCommandHandlers(handler)("any.type");
      const command: any = {
        name: "sample",
      };

      // acts
      const result = handlers.resolve(command);

      // asserts
      expect(result).to.equal(handler);
    });

    it("expect to get undefined when the command cannot resolve", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };
      const handlers = composeCommandHandlers(handler)("any.type");
      const command: any = {
        name: "other",
      };

      // acts
      const result = handlers.resolve(command);

      // asserts
      expect(result).to.equal(undefined);
    });
  });

  describe("#CommandHandlers.type()", () => {
    it("expect to get a type", () => {
      // arranges
      const handlers = composeCommandHandlers()("any.type");

      // acts
      const result = handlers.type();

      // asserts
      expect(result).to.equal("any.type");
    });
  });
});
*/
