import { expect } from "chai";
import { createService } from "./createService";

describe("createService.ts tests", () => {
  it("expect to create an instance of Service", async () => {
    // arranges
    const container = { scope: () => "TestScope" };
    const identifier: any = {};
    const stream: any = {};
    const configs: any = {
      type: "TestType",
    };

    // acts
    const service = await createService(container, identifier, stream, configs)();

    // asserts
    expect(service.scope()).to.equal("TestScope");
    expect(service.type()).to.equal("TestType");
    expect(service.configs()).to.equal(configs);
  });
});
