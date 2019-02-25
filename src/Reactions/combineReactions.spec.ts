import { expect } from "chai";
import * as sinon from "sinon";
import { combineReactions } from "./combineReactions";

describe("combineReactions.ts tests", () => {
  describe("#combineReactions()", () => {
    it("expect to combine the reactions", () => {
      // arranges
      const reaction: any = {
        name: "sample",
      };

      // acts
      const combine = combineReactions(reaction);

      // asserts
      expect(combine).not.to.equal(null);
      expect(combine).not.to.equal(undefined);
      expect(typeof combine).to.equal("function");
    });
  });

  describe("#Reactions.forEach()", () => {
    it("expect the callback get no called as no reactions", () => {
      // arranges
      const reactions = combineReactions()("any.type");
      const callback = sinon.spy();

      // acts
      reactions.forEach(callback);

      // asserts
      expect(callback.callCount).to.equal(0);
    });

    it("expect to call the callback with reactions", () => {
      // arranges
      const reaction1: any = {
        name: "sample1",
      };
      const reaction2: any = {
        name: "sample2",
      };
      const reactions = combineReactions(reaction1, reaction2)("any.type");
      const callback = sinon.spy();

      // acts
      reactions.forEach(callback);

      // asserts
      expect(callback.getCall(0).calledWith(reaction1)).to.equal(true);
      expect(callback.getCall(1).calledWith(reaction2)).to.equal(true);
    });
  });

  describe("#Reactions.type()", () => {
    it("expect to get a type", () => {
      // arranges
      const reactions = combineReactions()("any.type");

      // acts
      const result = reactions.type();

      // asserts
      expect(result).to.equal("any.type");
    });
  });
});
