import { expect } from "chai";
import { mapReactionsEvents } from "./mapReactionsEvents";

describe("mapReactionsEvents.ts tests", () => {
  describe("#mapReactionsEvents()", () => {
    it("expect to map an array of ReactionsEvents", async () => {
      // arranges
      const Reactions: any = [
        { scope: "S1", type: "T1", name: "N1", react: "R1" },
        { scope: "S2", type: "T2", name: "N2", react: "R2" },
        { scope: "S3", type: "T3", name: "N3", react: "R3" },
        { scope: "S4", type: "T4", name: "N4", react: "R4" },
      ];
      const definition: any = { Reactions };
      const expected: any = [
        { scope: "S1", type: "T1", name: "N1" },
        { scope: "S2", type: "T2", name: "N2" },
        { scope: "S3", type: "T3", name: "N3" },
        { scope: "S4", type: "T4", name: "N4" },
      ];

      // acts
      const result = mapReactionsEvents(definition);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
