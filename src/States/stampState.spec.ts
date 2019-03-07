import { expect } from "chai";
import { stampState } from "./stampState";

describe("stampState.ts tests", () => {
  describe("#stampState()", () => {
    it("expect to combine the command handlers", () => {
      // arranges
      const payloads = {
        name: "name",
      };
      const state: any = {
        _createdAt: new Date(),
        _createdBy: "createdBy",
        _id: 1,
        _updatedAt: new Date(),
        _updatedBy: "updatedBy",
        _version: 1,
        payloads,
      };
      const event: any = {
        _createdAt: new Date(),
        _createdBy: "createdBy",
        _version: 2,
      };
      const expected = {
        _createdAt: state._createdAt,
        _createdBy: "createdBy",
        _id: 1,
        _updatedAt: event._createdAt,
        _updatedBy: event._createdBy,
        _version: event._version,
        payloads: {
          name: "name",
        },
      };

      // acts
      const result = stampState(state, event);
      expected._updatedAt = result._updatedAt;

      // asserts
      expect(result).to.deep.equal(expected);
      expect(result.payloads).not.to.equal(payloads);
    });
  });
});
