import { expect } from "chai";
import { QueryResult } from "./QueryResult";

describe("QueryResult.ts tests", () => {
  describe("#QueryResult.accept()", () => {
    it("expect to get an accept result", () => {
      // arranges
      const ref = "12345";
      const expected = {
        accept: true,
        ref: "12345",
        status: "accepted",
      };

      // acts
      const result = QueryResult.accept(ref);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#QueryResult.invalid()", () => {
    it("expect to get an invalid result", () => {
      // arranges
      const invalidAttributes = {};
      const expected = {
        accept: false,
        invalidAttributes,
        status: "invalid",
      };

      // acts
      const result = QueryResult.invalid(invalidAttributes);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#QueryResult.unhandled()", () => {
    it("expect to get an unhandled result", () => {
      // arranges
      const expected = {
        accept: false,
        name: "name",
        status: "unhandled",
        type: "type",
      };

      // acts
      const result = QueryResult.unhandled("type", "name");

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
