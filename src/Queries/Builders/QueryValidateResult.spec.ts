import { expect } from "chai";
import { QueryValidateResult } from "./QueryValidateResult";

describe("QueryValidateResult.ts tests", () => {
  describe("#QueryValidateResult.valid()", () => {
    it("expect to get the valid result", () => {
      // arranges
      const expected = {
        isValid: true,
      };

      // acts
      const result = QueryValidateResult.valid();

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#QueryValidateResult.invalid()", () => {
    it("expect to get the invalid result", () => {
      // arranges
      const invalidAttributes = {};
      const expected = {
        invalidAttributes,
        isValid: false,
      };

      // acts
      const result = QueryValidateResult.invalid(invalidAttributes);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
