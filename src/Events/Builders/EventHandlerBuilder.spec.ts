import { expect } from "chai";
import { EventHandlerBuilder } from "./EventHandlerBuilder";

describe("EventHandlerBuilder.ts tests", () => {
  describe("#EventHandlerBuilder()", () => {
    it("expect to create an event handler", () => {
      // arranges
      const process: any = {};
      const expected = {
        name: "name",
        process: {},
      };

      // acts
      const result: any = EventHandlerBuilder({
        name: "name",
        process,
      });

      // asserts
      expect(result.name).to.deep.equal(expected.name);
      expect(result.process).to.deep.equal(expected.process);
    });

    it("expect to create an event handler with processEffect", () => {
      // arranges
      const process: any = {};
      const processEffect: any = {};
      const expected = {
        name: "name",
        process: {},
        processEffect: {},
      };

      // acts
      const result = EventHandlerBuilder({
        name: "name",
        process,
        processEffect,
      });

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
