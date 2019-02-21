import { expect } from "chai";
import Constants from "./Constants";

describe("Constants.ts tests", () => {
  it("expect the name to equal the key", () => {
    // arranges
    const keys = Object.keys(Constants);

    // acts
    for (const key of keys) {
      // asserts
      const name = key.substring(7);
      expect(name).to.equal(Constants[key].name);
    }
  });

  it("expect the key contains six chars of code", () => {
    // arranges
    const keys = Object.keys(Constants);

    // acts
    for (const key of keys) {
      // asserts
      const _ = key[6];
      expect(_).to.equal("_");
    }
  });

  it("expect the code to be unique", () => {
    // arranges
    const map: any = {};

    // acts
    Object.keys(Constants).forEach((key) => {
      // asserts
      const code = Constants[key].code;
      expect(map[code]).to.equal(undefined, `code: [${code}] not unique`);
      map[code] = true;
    });
  });
});
