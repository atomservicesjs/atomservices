import { expect } from "chai";
import * as sinon from "sinon";
import { composeReactions } from "./composeReactions";

describe("composeReactions.ts tests", () => {
  it("expect to compose an instance of Reactions", async () => {
    // arranges
    const reaction1: any = {
      name: "Reaction1",
      scope: "TEST",
      type: "Test",
    };
    const reaction2: any = {
      name: "Reaction2",
      scope: "TEST",
      type: "Test",
    };
    const type = "test";

    // acts
    const result = composeReactions(reaction1, reaction2)(type);

    // asserts
    expect(result).to.be.an("object");
  });

  describe("Reactions.resolve()", () => {
    it("expect to resolve the matching reactions and returning an empty array when not matched", async () => {
      // arranges
      const reaction1: any = {
        name: "Event_A",
        scope: "Scope",
        type: "Type",
      };
      const reaction2: any = {
        name: "Event_B",
        scope: "Scope",
        type: "Type",
      };
      const reaction3: any = {
        name: "Event_A",
        scope: "Scope",
        type: "Type",
      };
      const type = "test";
      const reactions = composeReactions(reaction1, reaction2, reaction3)(type);
      const event: any = {
        name: "Event_C",
        type: "Type",
      };

      // acts
      const result = reactions.resolve(event, "Scope");

      // asserts
      expect(result.length).to.equal(0);
      expect(result).to.deep.equal([]);
    });

    it("expect to resolve the matching reactions", async () => {
      // arranges
      const reaction1: any = {
        name: "Event_A",
        scope: "Scope",
        type: "Type",
      };
      const reaction2: any = {
        name: "Event_B",
        scope: "Scope",
        type: "Type",
      };
      const reaction3: any = {
        name: "Event_A",
        scope: "Scope",
        type: "Type",
      };
      const type = "test";
      const reactions = composeReactions(reaction1, reaction2, reaction3)(type);
      const event: any = {
        name: "Event_A",
        type: "Type",
      };

      // acts
      const result = reactions.resolve(event, "Scope");

      // asserts
      expect(result.length).to.equal(2);
      expect(result).to.deep.equal([reaction1, reaction3]);
    });
  });

  describe("Reactions.forEach()", () => {
    it("expect to callback with reaction", async () => {
      // arranges
      const reaction1: any = {
        name: "Event_A",
        scope: "Scope",
        type: "Type",
      };
      const reaction2: any = {
        name: "Event_B",
        scope: "Scope",
        type: "Type",
      };
      const reaction3: any = {
        name: "Event_C",
        scope: "Scope",
        type: "Type",
      };
      const type = "test";
      const reactions = composeReactions(reaction1, reaction2, reaction3)(type);
      const callback = sinon.spy();

      // acts
      const result = reactions.forEach(callback);

      // asserts
      expect(result).to.equal(3);
      expect(callback.callCount).to.equal(3);
      expect(callback.getCall(0).calledWith(reaction1)).to.equal(true);
      expect(callback.getCall(1).calledWith(reaction2)).to.equal(true);
      expect(callback.getCall(2).calledWith(reaction3)).to.equal(true);
    });
  });

  describe("Reactions.forEach()", () => {
    it("expect to callback with reaction", async () => {
      // arranges
      const type = "test";
      const reactions = composeReactions()(type);

      // acts
      const result = reactions.type();

      // asserts
      expect(result).to.equal(type);
    });
  });
});
