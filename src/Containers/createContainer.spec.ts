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

  describe("#container.isConnected", () => {
    it("expect to get a status of connected", () => {
      // arranges
      const container = createContainer("Test");

      // acts
      const result = container.isConnected;

      // asserts
      expect(result).to.equal(false);
    });

    it("expect to set a status of connected to throw an Error", () => {
      // arranges
      const container = createContainer("Test") as any;

      // acts
      const act = () => container.isConnected = true;

      // asserts
      expect(act).to.throw(Error);
    });
  });

  describe("#container.registerService()", () => {
    it("expect to register a service", async () => {
      // arranges
      const service: any = {
        // tslint:disable-next-line: no-empty
        connect: sinon.stub().callsFake(async () => { }),
      };
      const container = createContainer("Test");

      // acts
      const result = await container.registerService(service);

      // asserts
      expect(result).to.deep.equal(service);
      expect(service.connect.notCalled).to.equal(true);
    });
  });

  describe("#container.connect()", () => {
    it("expect to connect a service by container, #1", async () => {
      // arranges
      const service: any = {
        // tslint:disable-next-line: no-empty
        connect: sinon.stub().callsFake(async () => { }),
      };
      const container = createContainer("Test");

      // acts
      container.registerService(service);
      await container.connect();
      const result = container.isConnected;

      // asserts
      expect(result).to.equal(true);
      expect(service.connect.calledOnce).to.equal(true);
    });

    it("expect to connect a service by container, #2", async () => {
      // arranges
      const service: any = {
        // tslint:disable-next-line: no-empty
        connect: sinon.stub().callsFake(async () => { }),
      };
      const container = createContainer("Test");

      // acts
      await container.connect();
      const result = container.isConnected;
      await container.registerService(service);

      // asserts
      expect(result).to.equal(true);
      expect(service.connect.calledOnce).to.equal(true);
    });
  });
});
