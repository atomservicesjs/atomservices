import { expect } from "chai";
import * as sinon from "sinon";
import { composeServiceComponents } from "./composeServiceComponents";

describe("composeServiceComponents.ts tests", () => {
  describe("#composeServiceComponents()", () => {
    it("expect to compose service components without any provided composing components", () => {
      // arranges

      // acts
      const components = composeServiceComponents({});

      // asserts
      expect(typeof components.composeCommandHandlers).to.equal("function");
      expect(typeof components.composeEventHandlers).to.equal("function");
      expect(typeof components.composeQueryHandlers).to.equal("function");
      expect(typeof components.composeReactions).to.equal("function");
      expect(typeof components.repository).to.equal("object");
    });

    it("expect to compose EmptyRepository as not providing repository, throw error as calling function", async () => {
      // arranges
      const components: any = composeServiceComponents({});
      const repository = components.repository;

      // acts
      try {
        await repository.applyEvent();
      } catch (error) {
        // asserts
        expect(error.message).to.equal("Calling EmptyRepository on applyEvent()");
      }

      try {
        await repository.queryByID();
      } catch (error) {
        // asserts
        expect(error.message).to.equal("Calling EmptyRepository on queryByID()");
      }
    });

    it("expect to compose service components with provided composing components", () => {
      // arranges
      const composeCommandHandlers = sinon.spy();
      const composeEventHandlers = sinon.spy();
      const composeQueryHandlers = sinon.spy();
      const composeReactions = sinon.spy();
      const repository: any = {};

      // acts
      const components = composeServiceComponents({
        composeCommandHandlers,
        composeEventHandlers,
        composeQueryHandlers,
        composeReactions,
        repository,
      });

      // asserts
      expect(components.composeCommandHandlers).to.equal(composeCommandHandlers);
      expect(components.composeEventHandlers).to.equal(composeEventHandlers);
      expect(components.composeQueryHandlers).to.equal(composeQueryHandlers);
      expect(components.composeReactions).to.equal(composeReactions);
      expect(components.repository).to.equal(repository);
    });
  });
});
