import { expect } from "chai";
import { sign } from "./sign";

describe("sign.ts tests", () => {
  describe("#sign()", () => {
    it("expect to sign a simple JSON object, #1", () => {
      // arranges
      const type = "type";
      const scope = "scope";
      const obj1 = {
        key: "value",
      };
      const obj2 = {
        key: "value",
      };

      // acts
      const sign1 = sign(obj1, type, scope);
      const sign2 = sign(obj2, type, scope);

      // asserts
      expect(sign1).to.deep.equal(sign2);
    });

    it("expect to sign a simple JSON object, #2", () => {
      // arranges
      const type = "type";
      const scope = "scope";
      const obj1 = {
        key1: "value1",
        key2: "value2",
      };
      const obj2: any = {};
      obj2.key2 = "value2";
      obj2.key1 = "value1";

      // acts
      const sign1 = sign(obj1, type, scope);
      const sign2 = sign(obj2, type, scope);

      // asserts
      expect(sign1).to.deep.equal(sign2);
    });

    it("expect to sign a nested JSON", () => {
      // arranges
      const type = "type";
      const scope = "scope";
      const obj: any = {};
      obj.b = "b";
      obj.a = "a";
      obj.nestedObj = {};
      obj.nestedObj.d = ["d1", "d2"];
      obj.nestedObj.c = "c";

      const expected = sign({
        a: "a",
        b: "b",
        nestedObj: {
          c: "c",
          d: ["d1", "d2"],
        },
      }, type, scope);

      // acts
      const result = sign(obj, type, scope);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
