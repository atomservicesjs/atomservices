import { expect } from "chai";
import { QueryHandlerBuilder } from "./QueryHandlerBuilder";

describe("QueryHandlerBuilder.ts tests", () => {
  describe("#QueryHandlerBuilder()", () => {
    it("expect to create a query handler builder", () => {
      // arranges
      const name = "name";
      const query: any = {};
      const validate: any = {};
      const expected: any = {
        name: "name",
        query: {},
        validate,
      };

      // acts
      const result = QueryHandlerBuilder({ name, query, validate });

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
