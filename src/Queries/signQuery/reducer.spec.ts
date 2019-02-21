import { expect } from "chai";
import { reducer } from "./reducer";

describe("reducer.ts tests", () => {
  describe("#reducer()", () => {
    it("expect to reduce a new object as result", () => {
      // arranges
      const obj: any = {
        a: "a",
        b: "b",
        c: "c",
      };

      // acts
      const result = reducer(obj);

      // asserts
      expect(result).not.to.equal(obj);
    });

    it("expect to reduce an object", () => {
      // arranges
      const obj: any = {};
      obj.c = "c";
      obj.a = "a";
      obj.b = "b";

      const expected = JSON.stringify({
        a: "a",
        b: "b",
        c: "c",
      });

      // acts
      const result = reducer(obj);

      // asserts
      expect(JSON.stringify(result)).to.equal(expected);
    });

    it("expect to reduce a nested object, #1", () => {
      // arranges
      const obj: any = {};
      obj.b = "b";
      obj.a = "a";
      obj.nestedObj = {};
      obj.nestedObj.d = "d";
      obj.nestedObj.c = "c";

      const expected = JSON.stringify({
        a: "a",
        b: "b",
        nestedObj: {
          c: "c",
          d: "d",
        },
      });

      // acts
      const result = reducer(obj);

      // asserts
      expect(JSON.stringify(result)).to.equal(expected);
    });

    it("expect to reduce a nested object, #2", () => {
      // arranges
      const obj: any = {};
      obj.b = "b";
      obj.a = "a";
      obj.nestedObj = {};
      obj.nestedObj.d = ["d1", "d2"];
      obj.nestedObj.c = "c";

      const expected = JSON.stringify({
        a: "a",
        b: "b",
        nestedObj: {
          c: "c",
          d: ["d1", "d2"],
        },
      });

      // acts
      const result = reducer(obj);

      // asserts
      expect(JSON.stringify(result)).to.equal(expected);
    });
  });
});
