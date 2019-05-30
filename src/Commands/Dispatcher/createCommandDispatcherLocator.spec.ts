import { expect } from "chai";
import { createCommandDispatcherLocator } from "./createCommandDispatcherLocator";

describe("createCommandDispatcherLocator.ts tests", () => {
  describe("#createCommandDispatcherLocator()", () => {
    it("expect to create an instance of CommandDispatcherLocator", () => {
      // arranges
      const dispatcher1: any = {
        scope: () => "scope",
        type: () => "type1",
      };
      const dispatcher2: any = {
        scope: () => "scope",
        type: () => "type2",
      };

      const locator = createCommandDispatcherLocator();
      locator.register(dispatcher1);
      locator.register(dispatcher2);

      // acts
      const result1 = locator.resolve("scope", "type1");
      const result2 = locator.resolve("scope", "type2");
      const result3 = locator.resolve("scope", "other");
      const result4 = locator.resolve("other", "other");

      // asserts
      expect(result1).to.equal(dispatcher1);
      expect(result2).to.equal(dispatcher2);
      expect(result3).to.equal(undefined);
      expect(result4).to.equal(undefined);
    });
  });
});
