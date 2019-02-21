import { expect } from "chai";
import { EventTypeBuilder } from "./EventTypeBuilder";

describe("EventTypeBuilder.ts tests", () => {
  describe("#EventTypeBuilder()", () => {
    it("expect to compose a type into component", () => {
      // arranges
      const expected = {
        type: "test",
      };

      // acts
      const composer = EventTypeBuilder("test");
      const result = composer();

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to compose a type into component with state", () => {
      // arranges
      const state = { name: "sample" };
      const expected = {
        name: "sample",
        type: "test",
      };

      // acts
      const composer = EventTypeBuilder("test");
      const result = composer(state);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
