import { expect } from "chai";
import { tokenize } from "./tokenize";

describe("tokenize.ts tests", () => {
  describe("#tokenize()", () => {
    it("expect to tokenize an object", () => {
      // arranges
      const type = "type";
      const scope = "scope";
      const obj: any = {
        key: "value",
      };

      // acts
      const token1 = tokenize(obj, type, scope);
      const token2 = tokenize(obj, type, scope);

      // asserts
      expect(token1).to.equal(token2);
    });
  });
});
