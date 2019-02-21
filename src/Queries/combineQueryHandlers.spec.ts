import { expect } from "chai";
import * as sinon from "sinon";
import { combineQueryHandlers } from "./combineQueryHandlers";

describe("combineQueryHandlers.ts tests", () => {
  describe("#combineQueryHandlers()", () => {
    it("expect to combine the query handlers", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };

      // acts
      const combine = combineQueryHandlers(handler);

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
      const combine = combineQueryHandlers(handler1, handler2);
      const act = () => combine("type");

      // asserts
      expect(act).to.throw(Error, undefined, "[code: '000003'] - { type: test, name: duplicated }");
    });
  });

  describe("#QueryHandlers.forEach()", () => {
    it("expect the callback get no called as no handlers", () => {
      // arranges
      const handlers = combineQueryHandlers()("any.type");
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
      const handlers = combineQueryHandlers(handler1, handler2)("any.type");
      const callback = sinon.spy();

      // acts
      handlers.forEach(callback);

      // asserts
      expect(callback.getCall(0).calledWith(handler1)).to.equal(true);
      expect(callback.getCall(1).calledWith(handler2)).to.equal(true);
    });
  });

  describe("#QueryHandlers.resolve()", () => {
    it("expect to resolve a handler", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };
      const handlers = combineQueryHandlers(handler)("any.type");
      const query: any = {
        name: "sample",
      };

      // acts
      const result = handlers.resolve(query);

      // asserts
      expect(result).to.equal(handler);
    });

    it("expect to get undefined when the query cannot resolve", () => {
      // arranges
      const handler: any = {
        name: "sample",
      };
      const handlers = combineQueryHandlers(handler)("any.type");
      const query: any = {
        name: "other",
      };

      // acts
      const result = handlers.resolve(query);

      // asserts
      expect(result).to.equal(undefined);
    });
  });

  describe("#QueryHandlers.type()", () => {
    it("expect to get a type", () => {
      // arranges
      const handlers = combineQueryHandlers()("any.type");

      // acts
      const result = handlers.type();

      // asserts
      expect(result).to.equal("any.type");
    });
  });
});
