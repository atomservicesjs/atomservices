import { expect } from "chai";
import { compose } from "./compose";

describe("compose.ts tests", () => {
  describe("#compose()", () => {
    it("expect to compose a context provider", () => {
      // arranges
      const stores: any = {};
      const stream: any = {};
      const identifier: any = {};

      // acts
      const provider = compose(stores, stream, identifier);

      // asserts
      expect(typeof provider).to.equal("object");
    });
  });

  describe("#ContextProvider.provide()", () => {
    it("expect to provide a service context", () => {
      // arranges
      const stores: any = {};
      const stream: any = {};
      const identifier: any = {};
      const provider = compose(stores, stream, identifier);

      // acts
      const context = provider.provide("type", {});

      // asserts
      expect(context.type()).to.equal("type");
    });

    it("expect to provide a service context with default scope", () => {
      // arranges
      const stores: any = {};
      const stream: any = {};
      const identifier: any = {};
      const provider = compose(stores, stream, identifier);

      // acts
      const context = provider.provide("type", {});

      // asserts
      expect(context.scope()).to.equal("GLOBAL");
    });
  });
});
