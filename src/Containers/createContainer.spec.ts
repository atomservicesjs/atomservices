import { expect } from "chai";
import { createContainer } from "./createContainer";

describe("createContainer.ts tests", () => {
  describe("#createContainer()", () => {
    it("expect to create a container bootstrap", () => {
      // arranges
      const name = "Name";

      // acts
      const container = createContainer({ name, services: [] });

      // asserts
      expect(typeof container).to.equal("function");
    });
  });

  /* describe("#Container.configs()", () => {
    it("expect to get container configs", () => {
      // arranges
      const containerName = "ContainerName";
      const containerConfigs = {};
      const provider: any = {};
      const container = createContainer(containerName, containerConfigs, provider);

      // acts
      const result = container.configs();

      // asserts
      expect(result).to.equal(containerConfigs);
    });
  });

  describe("#Container.name()", () => {
    it("expect to get a container name", () => {
      // arranges
      const containerName = "ContainerName";
      const containerConfigs = {};
      const provider: any = {};
      const container = createContainer(containerName, containerConfigs, provider);

      // acts
      const result = container.name();

      // asserts
      expect(result).to.equal(containerName);
    });
  });

  describe("#Container.provide()", () => {
    it("expect to call ContextProvider.provide()", () => {
      // arranges
      const containerName = "ContainerName";
      const containerConfigs = {};
      const configs = {};
      const provider: any = {
        provide: sinon.spy(),
      };
      const container = createContainer(containerName, containerConfigs, provider);

      // acts
      container.provide("type", configs);

      // asserts
      expect(provider.provide.calledWith("type", configs)).to.equal(true);
    });
  });

  describe("#Container.provide()", () => {
    it("expect to call ContextProvider.provide()", () => {
      // arranges
      const containerName = "ContainerName";
      const containerConfigs = {};
      const configs = {};
      const provider: any = {
        provide: sinon.spy(),
      };
      const container = createContainer(containerName, containerConfigs, provider);

      // acts
      container.provide("type", configs);

      // asserts
      expect(provider.provide.calledWith("type", configs)).to.equal(true);
    });
  });

  describe("#Container.service()", () => {
    it("expect to get service", () => {
      // arranges
      const containerName = "ContainerName";
      const containerConfigs = {};
      const provider: any = {};
      const service: any = {
        name: () => "test.service",
      };
      const container = createContainer(containerName, containerConfigs, provider);
      container.registerService(service);

      // acts
      const result1 = container.service("test.service");
      const result2 = container.service("other.service");

      // asserts
      expect(result1).to.equal(service);
      expect(result2).to.equal(undefined);
    });
  });

  describe("#Container.serviceNames()", () => {
    it("expect to get an array of service names", () => {
      // arranges
      const containerName = "ContainerName";
      const containerConfigs = {};
      const provider: any = {};
      const service1: any = {
        name: () => "test.service1",
      };
      const service2: any = {
        name: () => "test.service2",
      };
      const container = createContainer(containerName, containerConfigs, provider);
      container.registerService(service1);
      container.registerService(service2);

      // acts
      const result = container.serviceNames();

      // asserts
      expect(result).to.deep.equal(["test.service1", "test.service2"]);
    });
  });

  describe("#Container.services()", () => {
    it("expect to get an array of services", () => {
      // arranges
      const containerName = "ContainerName";
      const containerConfigs = {};
      const provider: any = {};
      const service1: any = {
        name: () => "test.service1",
      };
      const service2: any = {
        name: () => "test.service2",
      };
      const container = createContainer(containerName, containerConfigs, provider);
      container.registerService(service1);
      container.registerService(service2);

      // acts
      const result = container.services();

      // asserts
      expect(result).to.deep.equal([service1, service2]);
    });
  });*/
});
