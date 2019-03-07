import { expect } from "chai";
import { ValidateResult } from "./ValidateResult";

describe("ValidateResult.ts tests", () => {
  describe("#ValidateResult.valid()", () => {
    it("expect to get the valid result", () => {
      // arranges
      const expected = {
        isValid: true,
      };

      // acts
      const result = ValidateResult.valid();

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#ValidateResult.invalid()", () => {
    it("expect to get the invalid result", () => {
      // arranges
      const invalidAttributes = {};
      const expected = {
        invalidAttributes,
        isValid: false,
      };

      // acts
      const result = ValidateResult.invalid(invalidAttributes);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
