import { expect } from "chai";
import { getInstance, setInstance } from "./Instance";

describe("Instance.ts tests", () => {
  describe("#setInstance() and getInstance()", () => {
    it("expect to set and to get a context provider", () => {
      // arranges
      const provider: any = {};

      // acts
      setInstance(provider);
      const result = getInstance();

      // asserts
      expect(result).to.equal(provider);
    });
  });
});
