import { expect } from "chai";
import { CommandHandlerBuilder } from "./CommandHandlerBuilder";

describe("Commands/Builders/CommandHandlerBuilder.ts tests", () => {
  describe("#CommandHandlerBuilder()", () => {
    it("expect to create a command handler builder", () => {
      // arranges
      const name = "name";
      const transform: any = {};
      const validate: any = {};
      const expected: any = {
        hook: {},
        name: "name",
        transform: {},
        validate: {},
      };

      // acts
      const result = CommandHandlerBuilder({ name, transform, validate });

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
