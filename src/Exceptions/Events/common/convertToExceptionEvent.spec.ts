import { expect } from "chai";
import { convertToExceptionEvent } from "./convertToExceptionEvent";

describe("Exception Events tests", () => {
  it("expect CurrentVersionQueryingError", () => {
    // arranges
    const _createdAt = new Date();
    const event: any = {
      _createdAt,
      _createdBy: "createdBy",
      _id: "id",
      _version: 10,
      aggregateID: "aggregateID",
      name: "name",
      payloads: {
        key: "value",
      },
      type: "type",
    };
    const error: any = {
      code: "error.code",
      message: "error.message",
      name: "error.name",
    };
    const expected: any = {
      _createdAt: undefined,
      _createdBy: "createdBy",
      _id: "id",
      _version: 10,
      aggregateID: "aggregateID",
      name: "_test",
      payloads: {
        error: {
          code: "error.code",
          message: "error.message",
          name: "error.name",
        },
        event: {
          _createdAt,
          _version: 10,
          name: "name",
          payloads: {
            key: "value",
          },
          type: "type",
        },
      },
      type: "exceptions",
    };

    // acts
    const exception = convertToExceptionEvent("test", event, error);
    expected._createdAt = exception._createdAt;

    // asserts
    expect(exception).to.deep.equal(expected);
  });
});
