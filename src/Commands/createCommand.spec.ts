import { expect } from "chai";
import { CommandBuilder } from "./Builders/CommandBuilder";
import { createCommand } from "./createCommand";

describe("createCommand.ts tests", () => {
  describe("#createCommand()", () => {
    it("expect to create a new instance of Command", () => {
      // arranges
      const name = "name";
      const payloads = {
        key: "value",
      };
      const version = 1;
      const createdAt: Date = new Date();
      const createdBy: any = {
        id: 10101,
      };
      const expected = {
        _createdAt: createdAt,
        _createdBy: createdBy,
        _version: version,
        name,
        payloads,
      };

      // acts
      const command = createCommand(name, payloads, version, createdAt, createdBy);

      // asserts
      expect(command).to.deep.equal(expected);
    });

    it("expect to create a new instance of Command as equal to CommandBuilder", () => {
      // arranges
      const name = "name";
      const payloads = {
        key: "value",
      };
      const version = 1;
      const createdBy: any = {
        id: 10101,
      };

      // acts
      const command = CommandBuilder(
        {
          createdBy,
          name,
          version,
        },
        payloads,
      );
      const expected = createCommand(name, payloads, version, command._createdAt, createdBy);

      // asserts
      expect(command).to.deep.equal(expected);
    });
  });
});
