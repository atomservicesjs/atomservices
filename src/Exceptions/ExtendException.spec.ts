import { expect } from "chai";
import { ExtendException } from "./ExtendException";

describe("ExtendException.ts tests", () => {
  it("expect to create an instance of ExtendException", () => {
    // arranges
    const expected = {
      code: "0000",
      description: "Description",
      message: "['0000'-Test] : Description",
      name: "Test",
    };

    // acts
    const result = new ExtendException("0000", "Test", "Description");

    // asserts
    expect(result.code).to.deep.equal(expected.code);
    expect(result.name).to.deep.equal(expected.name);
    expect(result.description).to.deep.equal(expected.description);
    expect(result.message).to.deep.equal(expected.message);
  });

  it("expect to create an instance of ExtendException with extension", () => {
    // arranges
    const expected = {
      code: "0000",
      description: "Description",
      message: "['0000'-Test] : Description",
      meta: { key: "value" },
      name: "Test",
    };

    // acts
    const result: any = new ExtendException("0000", "Test", "Description", { meta: { key: "value" } });

    // asserts
    expect(result.code).to.deep.equal(expected.code);
    expect(result.name).to.deep.equal(expected.name);
    expect(result.description).to.deep.equal(expected.description);
    expect(result.message).to.deep.equal(expected.message);
    expect(result.meta).to.deep.equal(expected.meta);
  });
});
