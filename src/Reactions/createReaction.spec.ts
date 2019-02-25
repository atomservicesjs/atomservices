import { expect } from "chai";
import { ReactionBuilder } from "./Builders/ReactionBuilder";
import { createReaction } from "./createReaction";

describe("createReaction.ts tests", () => {
  describe("#createReaction()", () => {
    it("expect to create a new instance of Reaction", () => {
      // arranges
      const scope = "scope";
      const type = "type";
      const name = "name";
      const react: any = {};
      const expected = {
        name,
        react,
        scope,
        type,
      };

      // acts
      const reaction = createReaction(scope, type, name, react);

      // asserts
      expect(reaction).to.deep.equal(expected);
    });

    it("expect to create a new instance of Reaction as equal to ReactionBuilder", () => {
      // arranges
      const scope = "scope";
      const type = "type";
      const name = "name";
      const react: any = {};

      // acts
      const reaction = ReactionBuilder({
        name,
        react,
        scope,
        type,
      });
      const expected = createReaction(scope, type, name, react);

      // asserts
      expect(reaction).to.deep.equal(expected);
    });
  });
});
