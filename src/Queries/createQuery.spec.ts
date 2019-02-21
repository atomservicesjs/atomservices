import { expect } from "chai";
import { QueryBuilder } from "./Builders/QueryBuilder";
import { createQuery } from "./createQuery";

describe("createQuery.ts tests", () => {
  describe("#createQuery()", () => {
    it("expect to create a new instance of Query", () => {
      // arranges
      const name = "name";
      const payloads = {
        key: "value",
      };
      const expected = {
        name,
        payloads,
      };

      // acts
      const query = createQuery(name, payloads);

      // asserts
      expect(query).to.deep.equal(expected);
    });

    it("expect to create a new instance of Query as equal to QueryBuilder", () => {
      // arranges
      const name = "name";
      const payloads = {
        key: "value",
      };

      // acts
      const query = QueryBuilder(
        {
          name,
        },
        payloads,
      );
      const expected = createQuery(name, payloads);

      // asserts
      expect(query).to.deep.equal(expected);
    });
  });
});
