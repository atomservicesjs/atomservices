import { expect } from "chai";
import * as sinon from "sinon";
import { ExtendException } from "../Exceptions/ExtendException";
import { combineCommandDispatchers } from "./combineCommandDispatchers";

describe("Commands/combineCommandDispatchers.ts tests", () => {
  describe("#combineCommandDispatchers()", () => {
    it("expect to throw an exception when combine invalid scope command dispatchers", () => {
      // arranges
      const scope = "Test";
      const dispatcher: any = {
        scope: () => "others",
      };

      // acts
      const act = () => combineCommandDispatchers(scope, dispatcher);

      // asserts
      expect(act).to.throw(ExtendException);
    });

    it("expect to throw an exception when combine duplicated command dispatchers", () => {
      // arranges
      const scope = "Test";
      const dispatcher1: any = {
        scope: () => "Test",
        type: () => "Type",
      };

      const dispatcher2: any = {
        scope: () => "Test",
        type: () => "Type",
      };

      // acts
      const act = () => combineCommandDispatchers(scope, dispatcher1, dispatcher2);

      // asserts
      expect(act).to.throw(ExtendException);
    });

    it("expect to combine command dispatchers", () => {
      // arranges
      const scope = "Test";
      const dispatcher1: any = {
        scope: () => "Test",
        type: () => "Type1",
      };
      const dispatcher2: any = {
        scope: () => "Test",
        type: () => "Type2",
      };

      // acts
      const dispatchers = combineCommandDispatchers(scope, dispatcher1, dispatcher2);

      // asserts
      expect(dispatchers).not.to.equal(null);
      expect(dispatchers).not.to.equal(undefined);
      expect(dispatchers.dispatch).to.be.a("function");
    });

    it("expect to call dispatcher when dispatch a command", () => {
      // arranges
      const scope = "Test";
      const dispatcher1 = {
        dispatch: sinon.spy(),
        scope: () => "Test",
        type: () => "Type1",
      };
      const dispatcher2: any = {
        dispatch: sinon.spy(),
        scope: () => "Test",
        type: () => "Type2",
      };
      const dispatchers = combineCommandDispatchers(scope, dispatcher1, dispatcher2);
      const cmd: any = {};

      // acts
      dispatchers.dispatch("Type1", cmd);

      // asserts
      expect(dispatcher1.dispatch.calledWith(cmd)).to.equal(true);
    });
  });
});
