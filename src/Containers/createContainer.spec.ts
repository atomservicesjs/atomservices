/*
import { expect } from "chai";
import * as sinon from "sinon";
import { createContainer } from "./createContainer";

describe("createContainer.ts tests", () => {
  describe("#container.connect()", () => {
    it("expect to connect a service by container", async () => {
      // arranges
      const service: any = {
        // tslint:disable-next-line: no-empty
        connect: sinon.stub().callsFake(async () => { }),
      };
      const container = createContainer(service);

      // acts
      await container.connect();

      // asserts
      expect(service.connect.calledOnce).to.equal(true);
    });
  });
});
*/
