import { expect } from "chai";
import { sign } from "./sign";
import { verify } from "./verify";

describe("verify.ts tests", () => {
  describe("#verify()", () => {
    it("expect to sign a simple JSON object, #1", () => {
      // arranges
      const type = "type";
      const scope = "scope";
      const obj1: any = {
        key: "value",
      };
      const obj2: any = {
        key: "value",
      };
      const { token } = sign(obj1, type, scope);

      // acts
      const result = verify(obj2, type, scope, token);

      // asserts
      expect(result).to.equal(true);
    });
  });
});
