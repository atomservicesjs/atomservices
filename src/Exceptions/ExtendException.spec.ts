import { expect } from "chai";
import { ExtendException } from "./ExtendException";

describe("ExtendException.ts tests", () => {
  it("expect to create an instance of ExtendException", () => {
    // arranges
    const expected = {
      code: "0000",
      message: "[code: '0000'] - Message",
      name: "Test",
    };

    // acts
    const result = new ExtendException("0000", "Test", "Message");

    // asserts
    expect(result.code).to.deep.equal(expected.code);
    expect(result.message).to.deep.equal(expected.message);
    expect(result.name).to.deep.equal(expected.name);
  });

  it("expect to create an instance of ExtendException", () => {
    // arranges
    const expected = {
      code: "0000",
      message: "[code: '0000'] - Message",
      meta: { key: "value" },
      name: "Test",
    };

    // acts
    const result: any = new ExtendException("0000", "Test", "Message", { meta: { key: "value" } });

    // asserts
    expect(result.code).to.deep.equal(expected.code);
    expect(result.message).to.deep.equal(expected.message);
    expect(result.name).to.deep.equal(expected.name);
    expect(result.meta).to.deep.equal(expected.meta);
  });
});
