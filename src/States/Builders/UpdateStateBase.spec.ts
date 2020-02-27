import { expect } from "chai";
import { UpdateStateBase } from "./UpdateStateBase";

describe("UpdateStateBase.ts tests", () => {
  describe("#UpdateStateBase()", () => {
    it("expect to update a state base from event", async () => {
      // arranges
      const _createdAt = new Date(2020, 10, 30);
      const now = new Date();
      const event: any = {
        _createdAt: now,
        _createdBy: "_createdBy",
        _version: 2,
        aggregateID: "1234567890",
      };
      const state = {
        _id: "1234567890",

        _createdAt,
        _createdBy: "_x_createdBy",
        _updatedAt: _createdAt,
        _updatedBy: "_x_createdBy",
        _version: 1,
        prop_a: "a",
        prop_b: "b",
        prop_c: "c",
      };
      const expected = {
        _id: "1234567890",

        _createdAt,
        _createdBy: "_x_createdBy",
        _updatedAt: now,
        _updatedBy: "_createdBy",
        _version: 2,
        prop_a: "a",
        prop_b: "b",
        prop_c: "c",
      };

      // acts
      const result = UpdateStateBase(event, state);

      // asserts
      expect(result).to.not.deep.equal(state);
      expect(result).to.deep.equal(expected);
    });
  });
});
