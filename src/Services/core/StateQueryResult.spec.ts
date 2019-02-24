import { expect } from "chai";
import { StateQueryResult } from "./StateQueryResult";

describe("StateQueryResult.ts tests", () => {
  describe("#StateQueryResult().error()", () => {
    it("expect to create the error result", () => {
      // arranges
      const Result = StateQueryResult({
        action: "process",
        name: "test",
        ref: "ref",
        scope: "scope",
        type: "type",
      });
      const error: any = {
        message: "error.message",
      };
      const expected = {
        _ref: "ref",
        error: {
          message: "error.message",
        },
        origin: {
          action: "process",
          name: "test",
          scope: "scope",
          type: "type",
        },
        status: "error",
      };

      // acts
      const result = Result.error(error);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#StateQueryResult().success()", () => {
    it("expect to create the success result", () => {
      // arranges
      const Result = StateQueryResult({
        action: "process",
        name: "test",
        ref: "ref",
        scope: "scope",
        type: "type",
      });
      const state: any = {
        data1: "data1",
        data2: "data2",
        data3: "data3",
      };
      const expected = {
        _ref: "ref",
        origin: {
          action: "process",
          name: "test",
          scope: "scope",
          type: "type",
        },
        state: {
          data1: "data1",
          data2: "data2",
          data3: "data3",
        },
        status: "success",
      };

      // acts
      const result = Result.success(state);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#StateQueryResult().unhandled()", () => {
    it("expect to create the unhandled result", () => {
      // arranges
      const Result = StateQueryResult({
        action: "process",
        name: "test",
        ref: "ref",
        scope: "scope",
        type: "type",
      });
      const expected = {
        _ref: "ref",
        origin: {
          action: "process",
          name: "test",
          scope: "scope",
          type: "type",
        },
        status: "unhandled",
      };

      // acts
      const result = Result.unhandled();

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
