import { expect } from "chai";
import * as sinon from "sinon";
import { composeProcessResult } from "./composeProcessResult";

describe("composeProcessResult.ts tests", () => {
  describe("#composeProcessResult()", () => {
    it("expect to create the process result function", () => {
      // arranges
      const context: any = {};
      const stateResult: any = {};

      // acts
      const processResult = composeProcessResult(context, stateResult);

      // asserts
      expect(typeof processResult).to.equal("function");
    });

    it("expect to call process result function", () => {
      // arranges
      const sample: any = {};
      const context: any = {
        directTo: sinon.spy(),
      };
      const stateResult = {
        success: sinon.stub().callsFake(() => sample),
      };
      const processResult = composeProcessResult(context, stateResult);
      const event: any = {
        _id: "id",
      };
      const result: any = {};

      // acts
      processResult(event, result);

      // asserts
      expect(stateResult.success.calledWith(result)).to.equal(true);
      expect(context.directTo.calledWith("id", sample)).to.equal(true);
    });
  });
});
