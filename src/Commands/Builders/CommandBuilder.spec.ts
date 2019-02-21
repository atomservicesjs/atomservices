import { expect } from "chai";
import { CommandBuilder } from "./CommandBuilder";

describe("CommandBuilder.ts tests", () => {
  describe("#CommandBuilder()", () => {
    it("expect to create a command builder", () => {
      // arranges
      const expected: any = {
        _createdAt: "",
        _createdBy: "createdBy",
        _version: 1,
        name: "name",
        payloads: {
          fname: "First Name",
          lname: "Last Name",
        },
      };

      // acts
      const registerAccount = (fname: string, lname: string) =>
        CommandBuilder({ name: "name", version: 1, createdBy: "createdBy" }, { fname, lname });
      const result = registerAccount("First Name", "Last Name");

      // asserts
      expected._createdAt = result._createdAt;
      expect(result).to.deep.equal(expected);
    });
  });
});
