import { expect } from "chai";
import { CommandValidateResult } from "./CommandValidateResult";

describe("CommandValidateResult.ts tests", () => {
  describe("#CommandValidateResult.valid()", () => {
    it("expect to get the valid result", () => {
      // arranges
      const expected = {
        isValid: true,
      };

      // acts
      const result = CommandValidateResult.valid();

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#CommandValidateResult.invalid()", () => {
    it("expect to get the invalid result", () => {
      // arranges
      const invalidAttributes = {};
      const expected = {
        invalidAttributes,
        isValid: false,
      };

      // acts
      const result = CommandValidateResult.invalid(invalidAttributes);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
