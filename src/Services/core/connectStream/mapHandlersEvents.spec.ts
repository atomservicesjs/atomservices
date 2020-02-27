import { expect } from "chai";
import { mapHandlersEvents } from "./mapHandlersEvents";

describe("mapHandlersEvents.ts tests", () => {
  describe("#mapHandlersEvents()", () => {
    it("expect to map an array of HandlersEvents", async () => {
      // arranges
      const EventHandlers: any = [
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
      ];
      const ServiceConfigurate: any = {
        level: (name: string) => {
          const Scopes = ["B", "C"];

          if (Scopes.indexOf(name) === -1) {
            return "Public";
          } else {
            return "Scope";
          }
        },
        processType: (name: string) => {
          const Synchronous = ["C", "D"];

          if (Synchronous.indexOf(name) === -1) {
            return "asynchronous";
          } else {
            return "synchronous";
          }
        },
      };
      const definition: any = {
        EventHandlers,
        ServiceConfigurate,
      };
      const expected: any = [
        { name: "A", level: "Public" },
        { name: "B", level: "Scope" },
        { name: "C", level: "Scope" },
        { name: "D", level: "Public" },
      ];

      // acts
      const result = mapHandlersEvents(definition);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
