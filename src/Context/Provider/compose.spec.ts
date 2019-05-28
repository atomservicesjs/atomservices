import { expect } from "chai";
import { compose } from "./compose";

describe("compose.ts tests", () => {
  describe("#compose()", () => {
    it("expect to compose a context provider", () => {
      // arranges
      const composeEventStores: any = () => ({});
      const composeEventStream: any = () => ({});
      const composeIdentifier: any = () => ({});

      // acts
      const provider = compose({ composeEventStores, composeEventStream, composeIdentifier });

      // asserts
      expect(typeof provider).to.equal("object");
    });
  });

  describe("#ContextProvider.provide()", () => {
    it("expect to provide a service context", () => {
      // arranges
      const composeEventStores: any = () => ({});
      const composeEventStream: any = () => ({});
      const composeIdentifier: any = () => ({});
      const provider = compose({ composeEventStores, composeEventStream, composeIdentifier });

      // acts
      const context = provider.provide("type", {});

      // asserts
      expect(context.type()).to.equal("type");
    });

    it("expect to provide a service context with default scope", () => {
      // arranges
      const composeEventStores: any = () => ({});
      const composeEventStream: any = () => ({});
      const composeIdentifier: any = () => ({});
      const provider = compose({ composeEventStores, composeEventStream, composeIdentifier });

      // acts
      const context = provider.provide("type", {});

      // asserts
      expect(context.scope()).to.equal("GLOBAL");
    });
  });
});
