import { expect } from "chai";
import { ComponentTypeBuilder } from "./ComponentTypeBuilder";

describe("ComponentTypeBuilder.ts tests", () => {
  describe("#ComponentTypeBuilder()", () => {
    it("expect to compose a component", () => {
      // arranges
      const expected = {
        type: "test",
      };

      // acts
      const composer = ComponentTypeBuilder("test");
      const result = composer();

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to compose a component with compose argument", () => {
      // arranges
      const compose = (o: any) => {
        o.other = "other";

        return o;
      };
      const expected = {
        other: "other",
        type: "test",
      };

      // acts
      const composer = ComponentTypeBuilder("test", compose);
      const result = composer();

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to compose a component with state", () => {
      // arranges
      const state = { init: "init" };
      const expected = {
        init: "init",
        type: "test",
      };

      // acts
      const compose = ComponentTypeBuilder("test");
      const result = compose(state);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
