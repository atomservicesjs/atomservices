import { expect } from "chai";
import * as sinon from "sinon";
import { createContainer } from "./createContainer";

describe("createContainer.ts tests", () => {
  describe("#container.scope()", () => {
    it("expect to get a container scope", () => {
      // arranges
      const container = createContainer("Test");

      // acts
      const result = container.scope();

      // asserts
      expect(result).to.equal("Test");
    });
  });

  describe("#container.connect()", () => {
    it("expect to connect a service by container", async () => {
      // arranges
      const service: any = {
        // tslint:disable-next-line: no-empty
        connect: sinon.stub().callsFake(async () => { }),
      };
      const container = createContainer("Test", service);

      // acts
      await container.connect();

      // asserts
      expect(service.connect.calledOnce).to.equal(true);
    });
  });
});
