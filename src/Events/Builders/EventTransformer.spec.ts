/*import { expect } from "chai";
import { EventNameBuilder } from "./EventNameBuilder";
import { EventTransformer } from "./EventTransformer";
import { EventTypeBuilder } from "./EventTypeBuilder";

describe("EventTransformer.ts tests", () => {
  const eventType = EventTypeBuilder("type");
  const eventBase = EventNameBuilder("name", eventType);

  describe("#EventTransformer()", () => {
    it("expect to create an event transformer", () => {
      // arranges
      const initial: any = {
        aggregateID: "aggregateID",
        id: "id",
        payloads: {},
      };
      const command: any = {
        _createdAt: "createdAt",
        _createdBy: "createdBy",
        _version: "version",
      };
      const expected: any = {
        _createdAt: "createdAt",
        _createdBy: "createdBy",
        _id: "id",
        _version: "version",
        aggregateID: "aggregateID",
        name: "name",
        payloads: {},
        type: "type",
      };

      // acts
      const result = EventTransformer(initial, command, eventBase);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});*/
