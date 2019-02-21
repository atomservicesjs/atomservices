import { expect } from "chai";
import { ComponentNameBuilder } from "./ComponentNameBuilder";

describe("ComponentNameBuilder.ts tests", () => {
  describe("#ComponentNameBuilder()", () => {
    it("expect to compose a component", () => {
      // arranges
      const expected = {
        name: "test",
      };

      // acts
      const composer = ComponentNameBuilder("test");
      const result = composer();

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to compose a component with compose argument", () => {
      // arranges
      const compose = (o: any) => {
        o.key = "key";

        return o;
      };
      const expected = {
        key: "key",
        name: "test",
      };

      // acts
      const composer = ComponentNameBuilder("test", compose);
      const result = composer();

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to compose a component with state", () => {
      // arranges
      const state = { init: "init" };
      const expected = {
        init: "init",
        name: "test",
      };

      // acts
      const compose = ComponentNameBuilder("test");
      const result = compose(state);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
