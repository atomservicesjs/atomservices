import { expect } from "chai";
import { EventBuilder } from "./Builders/EventBuilder";
import { createEvent } from "./createEvent";

describe("createEvent.ts tests", () => {
  describe("#createEvent()", () => {
    it("expect to create a new instance of Event", () => {
      // arranges
      const id = "101";
      const type = "type";
      const name = "name";
      const aggregateID = 1;
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
        _id: id,
        _version: version,
        aggregateID,
        name,
        payloads,
        type,
      };

      // acts
      const event = createEvent(id, type, name, aggregateID, payloads, version, createdAt, createdBy);

      // asserts
      expect(event).to.deep.equal(expected);
    });

    it("expect to create a new instance of Event as equal to EventBuilder", () => {
      // arranges
      const id = "101";
      const type = "type";
      const name = "name";
      const aggregateID = 1;
      const payloads = {
        key: "value",
      };
      const version = 1;
      const createdAt: Date = new Date();
      const createdBy: any = {
        id: 10101,
      };

      // acts
      const event = EventBuilder(
        {
          aggregateID,
          createdBy,
          id,
          version,
        },
        payloads,
        (obj) => {
          obj.type = type;
          obj.name = name;

          return obj;
        },
      );
      const expected = createEvent(id, type, name, aggregateID, payloads, version, createdAt, createdBy);

      // asserts
      expect(event).to.deep.equal(expected);
    });
  });
});
