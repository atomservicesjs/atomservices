import { expect } from "chai";
import { EventNameBuilder } from "./EventNameBuilder";
import { EventTypeBuilder } from "./EventTypeBuilder";

describe("EventNameBuilder.ts tests", () => {
  describe("#EventNameBuilder()", () => {
    it("expect to compose an event name builder", () => {
      // arranges
      const mockCompose: any = (o: object) => o;
      const expected = {
        name: "test",
      };

      // acts
      const compose = EventNameBuilder("test", mockCompose);
      const result = compose({});

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  it("expect to compose an event name builder with event type", () => {
    // arranges
    const eventType = EventTypeBuilder("type");
    const expected = {
      name: "name",
      type: "type",
    };

    // acts
    const compose = EventNameBuilder("name", eventType);
    const result = compose({});

    // asserts
    expect(result).to.deep.equal(expected);
  });
});
