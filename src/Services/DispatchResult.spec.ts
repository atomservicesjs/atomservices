import { expect } from "chai";
import { DispatchResult } from "./DispatchResult";

describe("DispatchResult.ts tests", () => {
  describe("#DispatchResult.accept()", () => {
    it("expect to get an accept result", () => {
      // arranges
      const ref = "12345";
      const expected = {
        accept: true,
        ref: "12345",
        status: "accepted",
      };

      // acts
      const result = DispatchResult.accept(ref);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#DispatchResult.invalid()", () => {
    it("expect to get an invalid result", () => {
      // arranges
      const invalidAttributes = {};
      const expected = {
        accept: false,
        invalidAttributes,
        status: "invalid",
      };

      // acts
      const result = DispatchResult.invalid(invalidAttributes);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#DispatchResult.unhandled()", () => {
    it("expect to get an unhandled result", () => {
      // arranges
      const expected = {
        accept: false,
        name: "name",
        status: "unhandled",
        type: "type",
      };

      // acts
      const result = DispatchResult.unhandled("type", "name");

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
