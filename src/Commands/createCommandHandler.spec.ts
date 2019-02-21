import { expect } from "chai";
import { CommandHandlerBuilder } from "./Builders/CommandHandlerBuilder";
import { createCommandHandler } from "./createCommandHandler";

describe("createCommandHandler.ts tests", () => {
  describe("#createCommandHandler()", () => {
    it("expect to create a new instance of CommandHandler", () => {
      // arranges
      const name = "name";
      const validate: any = {};
      const transform: any = {};
      const expected = {
        name,
        transform: {},
        validate: {},
      };

      // acts
      const handler = createCommandHandler(name, validate, transform);

      // asserts
      expect(handler).to.deep.equal(expected);
    });

    it("expect to create a new instance of CommandHandler as equal to CommandHandlerBuilder", () => {
      // arranges
      const name = "name";
      const validate: any = {};
      const transform: any = {};

      // acts
      const handler = CommandHandlerBuilder({
        name,
        transform,
        validate,
      });
      const expected = createCommandHandler(name, validate, transform);

      // asserts
      expect(handler).to.deep.equal(expected);
    });
  });
});
