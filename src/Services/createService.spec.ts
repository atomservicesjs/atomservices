import { expect } from "chai";
import * as sinon from "sinon";
import { createService } from "./createService";

describe("createService.ts tests", () => {
  it("expect to create an instance of Service", async () => {
    // arranges
    const scope = "TestScope";
    const container: any = {
      scope: () => scope,
      service: sinon.spy(),
    };
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
