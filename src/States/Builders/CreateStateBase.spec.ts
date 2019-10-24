import { expect } from "chai";
import { CreateStateBase } from "./CreateStateBase";

describe("CreateStateBase.ts tests", () => {
  describe("#CreateStateBase()", () => {
    it("expect to create a new state base from event", async () => {
      // arranges
      const now = new Date();
      const event: any = {
        _createdAt: now,
        _createdBy: "_createdBy",
        _version: 1,
        aggregateID: "1234567890",
      };
      const expected = {
        _id: "1234567890",

        _createdAt: now,
        _createdBy: "_createdBy",
        _updatedAt: now,
        _updatedBy: "_createdBy",
        _version: 1,
      };

      // acts
      const result = CreateStateBase(event);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
