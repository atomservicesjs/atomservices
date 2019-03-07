import { expect } from "chai";
import { CommandBuilder } from "./CommandBuilder";

describe("CommandBuilder.ts tests", () => {
  describe("#CommandBuilder()", () => {
    it("expect to create a command with name as minimal required", () => {
      // arranges
      const expected: any = {
        name: "name",
      };

      // acts
      const commander = () => CommandBuilder({ name: "name" });
      const result = commander();

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to create a command with name and payloads", () => {
      // arranges
      const expected: any = {
        name: "name",
        payloads: {
          fname: "First Name",
          lname: "Last Name",
        },
      };

      // acts
      const commander = (fname: string, lname: string) => CommandBuilder({ name: "name" }, { fname, lname });
      const result = commander("First Name", "Last Name");

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to create a command with full options", () => {
      // arranges
      const expected: any = {
        _createdBy: "createdBy",
        _version: 1,
        name: "name",
        payloads: {
          fname: "First Name",
          lname: "Last Name",
        },
      };

      // acts
      const commander = (fname: string, lname: string) =>
        CommandBuilder({ name: "name", version: 1, createdBy: "createdBy" }, { fname, lname });
      const result = commander("First Name", "Last Name");

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
