import { expect } from "chai";
import { EventBuilder } from "./EventBuilder";
import { EventNameBuilder } from "./EventNameBuilder";
import { EventTypeBuilder } from "./EventTypeBuilder";

describe("EventBuilder.ts tests", () => {
  describe("#EventBuilder()", () => {
    it("expect to create an event builder", () => {
      // arranges
      const id = "id";
      const aggregateID = "aggregateID";
      const version = 1;
      const createdBy = "createdBy";

      const payloads: any = {};
      const eventBase = (o: any) => {
        o.type = "type";
        o.name = "name";

        return o;
      };
      const expected: any = {
        _createdAt: "",
        _createdBy: "createdBy",
        _id: "id",
        _version: 1,
        aggregateID: "aggregateID",
        name: "name",
        payloads: {},
        type: "type",
      };

      // acts
      const result = EventBuilder({ id, aggregateID, version, createdBy }, payloads, eventBase);

      // asserts
      expected._createdAt = result._createdAt;
      expect(result).to.deep.equal(expected);
    });

    it("expect to create an event builder with type and name builder", () => {
      // arranges
      const id = "id";
      const type = "type";
      const name = "name";
      const aggregateID = "aggregateID";
      const version = 1;
      const createdBy = "createdBy";

      const payloads: any = {};
      const typeBase = EventTypeBuilder(type);
      const eventBase = EventNameBuilder(name, typeBase);

      const expected: any = {
        _createdAt: "",
        _createdBy: "createdBy",
        _id: "id",
        _version: 1,
        aggregateID: "aggregateID",
        name: "name",
        payloads: {},
        type: "type",
      };

      // acts
      const result = EventBuilder({ id, aggregateID, version, createdBy }, payloads, eventBase);

      // asserts
      expected._createdAt = result._createdAt;
      expect(result).to.deep.equal(expected);
    });
  });
});
