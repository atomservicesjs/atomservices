import { expect } from "chai";
import { composeReactions } from "./composeReactions";

describe("composeReactions.ts tests", () => {
  it("expect to create an instance of Service", async () => {
    // arranges
    const reaction1: any = {
      name: "Reaction1",
      scope: "TEST",
      type: "Test",
    };
    const reaction2: any = {
      name: "Reaction2",
      scope: "TEST",
      type: "Test",
    };
    const reactions = composeReactions(reaction1, reaction2);
    const event: any = {
      name: "Reaction1",
      type: "Test",
    };

    // acts
    const result = reactions.resolve(event, "TEST");

    // asserts
    expect(result.length).to.equal(1);
    expect(result[0]).to.equal(reaction1);
  });
});
