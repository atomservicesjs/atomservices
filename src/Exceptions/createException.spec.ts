import { expect } from "chai";
import { createException } from "./createException";

describe("createException.ts tests", () => {
  it("expect to create an instance of Exception", () => {
    // arranges
    const composed = {
      code: "0000",
      name: "Test",
    };
    const description = "Description";
    const expected = {
      code: "0000",
      message: "['0000'-Test] : Description",
      name: "Test",
    };

    // acts
    const result = createException(composed, description);

    // asserts
    expect(result.code).to.deep.equal(expected.code);
    expect(result.message).to.deep.equal(expected.message);
    expect(result.name).to.deep.equal(expected.name);
  });

  it("expect to create an instance of Exception with extension", () => {
    // arranges
    const composed = {
      code: "0000",
      name: "Test",
    };
    const description = "Description";
    const ext = {
      meta: {
        key: "value",
      },
    };
    const expected = {
      code: "0000",
      message: "['0000'-Test] : Description",
      meta: {
        key: "value",
      },
      name: "Test",
    };

    // acts
    const result = createException(composed, description, ext);

    // asserts
    expect(result.code).to.deep.equal(expected.code);
    expect(result.name).to.deep.equal(expected.name);
    expect(result.message).to.deep.equal(expected.message);
    expect(result.meta).to.deep.equal(expected.meta);
  });
});
