import { expect } from "chai";
import { QueryHandlerBuilder } from "./Builders/QueryHandlerBuilder";
import { createQueryHandler } from "./createQueryHandler";

describe("createQueryHandler.ts tests", () => {
  describe("#createQueryHandler()", () => {
    it("expect to create a new instance of QueryHandler", () => {
      // arranges
      const name = "name";
      const validate: any = {};
      const query: any = {};
      const expected = {
        name: "name",
        query: {},
        validate: {},
      };

      // acts
      const handler = createQueryHandler(name, validate, query);

      // asserts
      expect(handler).to.deep.equal(expected);
    });

    it("expect to create a new instance of QueryHandler as equal to QueryHandlerBuilder", () => {
      // arranges
      const name = "name";
      const validate: any = {};
      const query: any = {};

      // acts
      const handler = QueryHandlerBuilder({
        name,
        query,
        validate,
      });
      const expected = createQueryHandler(name, validate, query);

      // asserts
      expect(handler).to.deep.equal(expected);
    });
  });
});
