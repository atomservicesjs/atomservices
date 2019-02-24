import { expect } from "chai";
import { hashify } from "./hashify";

describe("hashify.ts tests", () => {
  describe("#hashify()", () => {
    it("expect to hash an object", () => {
      // arranges
      const obj: any = {
        a: "a",
        b: "b",
        c: "c",
      };
      const value = JSON.stringify(obj);

      // acts
      const result1 = hashify(value);
      const result2 = hashify(value);

      // asserts
      expect(result1).to.equal(result2);
    });
  });
});
