import { expect } from "chai";
import { EventHandlerBuilder } from "./EventHandlerBuilder";
import { EventNameBuilder } from "./EventNameBuilder";
import { EventTypeBuilder } from "./EventTypeBuilder";

describe("EventHandlerBuilder.ts tests", () => {
  const eventType = EventTypeBuilder("type");
  const eventBase = EventNameBuilder("name", eventType);

  describe("#EventHandlerBuilder()", () => {
    it("expect to create an event handler builder", () => {
      // arranges
      const process: any = {};
      const expected = {
        name: "name",
        process: {},
        type: "type",
      };

      // acts
      const result: any = EventHandlerBuilder({ process }, eventBase);

      // asserts
      expect(result.name).to.deep.equal(expected.name);
      expect(result.process).to.deep.equal(expected.process);
      expect(result.type).to.deep.equal(expected.type);
    });

    it("expect to create an event handler builder with processEffect", () => {
      // arranges
      const process: any = {};
      const processEffect: any = {};
      const expected = {
        name: "name",
        process: {},
        processEffect: {},
        type: "type",
      };

      // acts
      const result = EventHandlerBuilder({ process, processEffect }, eventBase);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
