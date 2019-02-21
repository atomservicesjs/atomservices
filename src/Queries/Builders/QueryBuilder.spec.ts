import { expect } from "chai";
import { QueryBuilder } from "./QueryBuilder";

describe("QueryBuilder.ts tests", () => {
  describe("#QueryBuilder()", () => {
    it("expect to create a query builder", () => {
      // arranges
      const expected: any = {
        name: "name",
        payloads: {
          fname: "First Name",
          lname: "Last Name",
        },
      };

      // acts
      const queryAccount = (fname: string, lname: string) => QueryBuilder({ name: "name" }, { fname, lname });
      const result = queryAccount("First Name", "Last Name");

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
